const User = require("../models/user");
const md5 = require('md5');

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

// @desc    API add user
// @route   /api/admin/user [POST]

exports.addUser = async (req, res, next) => {
  try {
    const {json} = req.query;
    const user = JSON.parse(json);
    const isExist = await User.find({username: user.username});
    let c;
    if(isExist){
      c = true;
    }
    if(c){
      user.password = md5(user.password);
      await User.create(user);
      const users = await User.find();
      res.json({success: true, data: users});
    } else {
      res.json({success: false, message: 'Your information is invalid!!!'});
    }
  } catch (error) {
    res.json({success: false, error: error});
  }
}

// @desc    API update user
// @route   /api/admin/user [PUT]

exports.updateUser = async (req, res, next) => {
  try {
    const {json, json2} = req.query;
    const newUser = JSON.parse(json);
    const oldUser = JSON.parse(json2);
    if(newUser.password !== oldUser.password){
      newUser.password = md5(newUser.password);
    }
    await User.updateOne({_id: oldUser._id}, newUser);
    const users = await User.find();
    res.json({success: true, data: users});
  } catch (error) {
    res.json({success: false, error: error});
  }
}
