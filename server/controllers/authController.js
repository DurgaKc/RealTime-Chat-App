const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./../models/user");
const authMiddleware = require('./../middlewares/authMiddleware')

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ validation
    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required",
        success: false,
      });
    }

    const user = await User
      .findOne({ email })
      .select("+password");   

    if (!user) {
      return res.status(400).send({
        message: "User does not exist",
        success: false,
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).send({
        message: "Invalid password",
        success: false,
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.send({
      message: "User logged in successfully",
      success: true,
      token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});


/* ================= PASSWORD CHANGE ================= */
router.put("/changePassword", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Check for required fields
  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Both old and new passwords are required" });
  }

  try {
    const userId = req.userId; // from auth middleware
   const user = await User.findById(userId).select("+password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Old password is incorrect" });

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
});


module.exports = router;
