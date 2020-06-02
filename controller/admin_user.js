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
