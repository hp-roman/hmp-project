const UserSchema = require('../models/user');
const StatisticSchema = require('../models/statistic');
const HistorySchema = require('../models/history');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const accessTokenSecret = 'healthy-meal-planner';

// desc     API register
// route    /api/user/register?username=&password=&confirm=

exports.register = async (req, res, next) => {
    try {
        let {
            username,
            password,
            confirm
        } = req.query;
        if (!username || !password || !confirm){
            return res.json({
                success: false,
                message: 'Vui lòng điền!!!'
            });
        }
        if(!username.match(/^[a-zA-Z_][a-zA-Z0-9_]{6,}/gi)){
            return res.json({
                success: false,
                message: 'Tên tài khoản không hợp lệ!!!'
            });
        }
        if(password.length < 6){
            return res.json({
                success: false,
                message: 'Mật khẩu quá ngắn!!!'
            });
        }
        if (confirm != password) {
            return res.json({
                success: false,
                message: 'Mật khẩu không khớp!!!'
            });
        }
        const users = await UserSchema.find({
            username: username
        });
        if (users.length != 0) {
            return res.json({
                success: false,
                message: 'Tài khoản đã tồn tại!!!'
            });
        } else {
            const statistic = await StatisticSchema.create({
                protein: 0,
                lipid: 0,
                glucid: 0
            });
            await UserSchema.create({
                username: username,
                password: md5(password),
                name: username,
                id_statistic: statistic._id
            });
            return res.status(201).json({
                success: true,
                message: 'Đăng ký thành công!!!'
            });
        }
    } catch (error) {

    }

};

// desc     API for loging in
// route    /api/user/login?username=&password=

exports.login = async (req, res, next) => {
    try {
        const {
            username,
            password
        } = req.query;
        if (!username || !password) return res.json({
            success: false,
            message: 'Đăng nhập thất bại!!!'
        });
        const users = await UserSchema.find({
            username: username,
            password: md5(password)
        });
        if (users.length == 0) {
            return res.json({
                success: false,
                message: 'Đăng nhập thất bại!!!'
            });
        } else {
            const history = await HistorySchema.find({token: users[0].token});
            const accessToken = jwt.sign({
                username: users[0].username
            }, accessTokenSecret);
            users[0].token = accessToken;
            if(history.length != 0){
                history.map(async value => {
                    await HistorySchema.update({_id: value._id}, {token: accessToken});
                });
            }
            await UserSchema.findByIdAndUpdate({_id: users[0]._id}, users[0]);
            res.json({
                success: true,
                message: 'Đăng nhập thành công',
                accessToken: accessToken
            });
        }

    } catch (error) {

    }
};

// desc     API for changing password
// route    /api/user/change?password=&newpassword=&newconfirm=&token=

exports.changePassword = async (req, res, next) => {
    const {password, newpassword, newconfirm, token} = req.query;
    if(!password || !newpassword || !newconfirm){
        return res.json({
            success: false,
            message: 'Vui lòng điền!!!'
        });
    }
    if(newpassword != newconfirm){
        return res.json({
            success: false,
            message: 'Mật khẩu không khớp!!!'
        });
    }
    const user = await UserSchema.findOne({
        password: md5(password),
        token: token
    });
    if(!user){
        return res.json({
            success: false,
            message: 'Sai mật khẩu!!!'
        });
    } else {
        user.password = md5(newpassword);
        await UserSchema.findByIdAndUpdate(user.id, user);
        return res.json({
            success: true,
            message: 'Đổi mật khẩu thành công!!!'
        });
    }

};