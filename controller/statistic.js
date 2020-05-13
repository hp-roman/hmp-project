const StatisticSchema = require('../models/statistic');
const UserSchema = require('../models/user');

// desc     api for detail statistic
// route    /api/statistic/:token

exports.getStatistic = async (req, res, next) => {
    try {
        const {
            token
        } = req.params;
        const user = await UserSchema.findOne({token: token});
        if(user){
            const statistic = await StatisticSchema.findById(user.id_statistic);
            res.status(200).json({
                success: true,
                data: statistic
            });
        }
    } catch (error) {

    }

};