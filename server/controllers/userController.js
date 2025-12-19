const router = require("express").Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddleware");

// get details of current logged-in user
router.get("/get-logged-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId); // from middleware

    res.send({
      message: "User fetched successfully!",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const allUsers = await User.find({ _id: { $ne: userId } });

    res.send({
      message: "All Users fetched successfully!",
      success: true,
      data: allUsers,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
