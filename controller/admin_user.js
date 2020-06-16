const User = require("../models/user");

// @desc    API get all user
// @route   /api/admin/user

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

// @desc    API delete user
// @route   /api/admin/user

exports.deleteUser = async (req, res, next) => {
  try {
    const { json } = req.query;
    const user = JSON.parse(json);
    await User.deleteOne({ _id: user._id });
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};
