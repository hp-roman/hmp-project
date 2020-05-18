const UserSchema = require("../models/user");
const StatisticSchema = require("../models/statistic");
const HistorySchema = require("../models/history");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

const accessTokenSecret = "healthy-meal-planner";

// desc     API register
// route    /api/user/register?username=&password=&confirm=

exports.register = async (req, res, next) => {
  try {
    let { username, password, confirm } = req.query;
    if (!username || !password || !confirm) {
      return res.json({
        success: false,
        message: "Vui lòng điền!!!",
      });
    }
    if (!username.match(/^[a-zA-Z_][a-zA-Z0-9_]{6,}/gi)) {
      return res.json({
        success: false,
        message: "Tên tài khoản không hợp lệ!!!",
      });
    }
    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Mật khẩu quá ngắn!!!",
      });
    }
    if (confirm != password) {
      return res.json({
        success: false,
        message: "Mật khẩu không khớp!!!",
      });
    }
    const users = await UserSchema.find({
      username: username,
    });
    if (users.length != 0) {
      return res.json({
        success: false,
        message: "Tài khoản đã tồn tại!!!",
      });
    } else {
      const statistic = await StatisticSchema.create({
        protein: 0,
        lipid: 0,
        glucid: 0,
      });
      await UserSchema.create({
        username: username,
        password: md5(password),
        name: username,
        id_statistic: statistic._id,
      });
      return res.status(201).json({
        success: true,
        message: "Đăng ký thành công!!!",
      });
    }
  } catch (error) {}
};

// desc     API for loging in
// route    /api/user/login?username=&password=

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.query;
    if (!username || !password)
      return res.json({
        success: false,
        message: "Đăng nhập thất bại!!!",
      });
    const users = await UserSchema.find({
      username: username,
      password: md5(password),
    });
    if (users.length == 0) {
      return res.json({
        success: false,
        message: "Đăng nhập thất bại!!!",
      });
    } else {
      const history = await HistorySchema.find({ token: users[0].token });
      const accessToken = jwt.sign(
        {
          username: users[0].username,
        },
        accessTokenSecret
      );
      users[0].token = accessToken;
      if (history.length != 0) {
        history.map(async (value) => {
          await HistorySchema.update(
            { _id: value._id },
            { token: accessToken }
          );
        });
      }
      await UserSchema.findByIdAndUpdate({ _id: users[0]._id }, users[0]);
      res.json({
        success: true,
        message: "Đăng nhập thành công",
        accessToken: accessToken,
      });
    }
  } catch (error) {}
};

// desc     API for changing password
// route    /api/user/change?password=&newpassword=&newconfirm=&token=

exports.changePassword = async (req, res, next) => {
  const { password, newpassword, newconfirm, token } = req.query;
  if (!password || !newpassword || !newconfirm) {
    return res.json({
      success: false,
      message: "Vui lòng điền!!!",
    });
  }
  if (newpassword != newconfirm) {
    return res.json({
      success: false,
      message: "Mật khẩu không khớp!!!",
    });
  }
  const user = await UserSchema.findOne({
    password: md5(password),
    token: token,
  });
  if (!user) {
    return res.json({
      success: false,
      message: "Sai mật khẩu!!!",
    });
  } else {
    user.password = md5(newpassword);
    await UserSchema.findByIdAndUpdate(user.id, user);
    return res.json({
      success: true,
      message: "Đổi mật khẩu thành công!!!",
    });
  }
};
const nodemailer = require("nodemailer");
// const Email = require("email-templates");
// desc     api for forget password
// route    /api/user/forget?username=&email=
exports.forgetPassword = async (req, res, next) => {
  try {
    const { username, email } = req.query;
    if (!username || !email)
      return res.json({ success: false, message: "Vui lòng điền!!!" });
    if (!(await UserSchema.findOne({ username: username })))
      return res.json({ success: false, message: `${username} không tồn tại` });
    if (!email.match(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim)) {
      return res.json({ success: false, message: "Email không đúng!!!" });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: process.env.user,
      to: email,
      subject: "Khôi phục mật khẩu",
      text: `Click here: https://hml-project.herokuapp.com/api/user/reset?username=${username}`,
    };
    transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Đã gửi email!!!" });
  } catch (error) {
    console.log(error);
  }
};

// desc     api reset password
// route    /api/user/reset?username=

exports.resetPassword = async (req, res, next) => {
  try {
    const { username } = req.query;
    const user = await UserSchema.findOne({ username: username });
    const password = parseInt(100000 + Math.random() * 899999);
    if (user) {
      await UserSchema.updateOne(
        { _id: user._id },
        { password: md5(password) }
      );
      res.send(`<h1>New password: ${password}</h1>`);
    } else {
      res.send("Hí hí");
    }
  } catch (error) {
    console.log(error);
  }
};
