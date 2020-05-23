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
    let { username, password, confirm, email } = req.query;
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
    if (!email.match(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim)) {
      return res.json({ success: false, message: "Email không đúng!!!" });
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
        email: email
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
          await HistorySchema.updateOne(
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
const { google } = require("googleapis");
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.CLIENT_URL
);

// desc     api for forget password
// route    /api/user/forget?username=&email=
exports.forgetPassword = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username)
      return res.json({ success: false, message: "Vui lòng điền!!!" });
    const user = await UserSchema.findOne({ username: username });
    if (!user){
      return res.json({ success: false, message: `${username} không tồn tại` });
    }   
    const email = user.email;
    const refreshToken = process.env.REFRESH_TOKEN;
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const accessToken = await oauth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: refreshToken,
        accessToken: accessToken.token,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
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
    const password = parseInt(100000 + Math.random() * 899999).toString();
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

// desc   api for feedback
// route  api/user/feedback?token=&content
exports.feedback = async (req, res, next) => {
  try {
    const { token, content } = req.query;
    const user = await UserSchema.findOne({token:token});
    const email = user.email;
    const refreshToken = process.env.REFRESH_TOKEN;
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const accessToken = await oauth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: refreshToken,
        accessToken: accessToken.token,
      },
    });
    const mailOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: `Feedback from ${user.username}`,
      text: `Content from ${email}: ${content}`,
    };
    transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Đã gửi feedback!!!" });
  } catch (error) {
    console.log(error);
  }
};

