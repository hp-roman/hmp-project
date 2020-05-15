const DishSchema = require('../models/dishes');
// @desc    API increasing views
// @route   /api/dish/:id

exports.increaseView = async (req, res, next) => {
    try {
        const {id} = req.params;
        const dishes = await DishSchema.find({
            _id: id
        });
        await DishSchema.findByIdAndUpdate(id, {
            view: dishes[0].view + 1
        });
        res.status(200).json({
            success: true,
            message: 'Updated successfully'
        });
    } catch (error) {

    }

};

exports.computePrice = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
};