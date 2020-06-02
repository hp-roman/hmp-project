const Dish = require('../models/dishes');

// @desc    API get all dishes
// @route   /api/admin/dish

exports.getDishes = async (req, res, next) => {
    try {
        const dishes = await Dish.find();
        res.json({success: true, data: dishes});
    } catch (error) {
        res.json({success: false, error: error});
    }
}