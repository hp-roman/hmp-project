const UserSchema = require('../models/user');
const StatisticSchema = require('../models/statistic');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const accessTokenSecret = 'healthy-meal-planner';

// desc     API register
// route    /api/user/register?username=&password=&confirm=

exports.register = async (req, res, next) => {
    try {
        const {
            username,
            password,
            confirm
        } = req.query;
        if (!username || !password || !confirm) return res.json({
            success: false,
            message: 'Vui lòng điền!!!'
        });
        if (confirm != password) {
            res.json({
                success: false,
                message: 'Mật khẩu không khớp!!!'
            });
        }
        const user = await UserSchema.find({
            username: username
        });
        if (user.length != 0) {
            res.json({
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
            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công!!!'
            });
        }
    } catch (error) {

    }

};

// desc     API for login
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
            res.json({
                success: false,
                message: 'Đăng nhập thất bại!!!'
            });
        } else {
            const accessToken = jwt.sign({
                username: users[0].username
            }, accessTokenSecret);

            res.json({
                success: true,
                message: 'Đăng nhập thành công',
                accessToken: accessToken
            });
        }

    } catch (error) {

    }
};