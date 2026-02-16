const router = require("express").Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddleware");
const cloudinary = require('./../cloudinary')

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

router.post('/upload-profile-pic', authMiddleware, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) return res.send({ message: "No image provided", success: false });

    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: 'quick-chat'
    });

    const user = await User.findByIdAndUpdate(
      req.user.id, // get from auth middleware, do not rely on frontend
      { profilePic: uploadedImage.secure_url },
      { new: true }
    );

    res.send({
      message: 'Profile picture uploaded successfully',
      success: true,
      data: user
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false
    });
  }
});


module.exports = router;
