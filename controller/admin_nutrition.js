const NutritionsSchema = require("../models/nutritions");

// @desc    API get nutritions
// @route   /api/admin/nutrition

exports.getNutritions = async (req, res, next) => {
  try {
    const nutritions = await NutritionsSchema.find();
    res.json({ success: true, data: nutritions });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

// @desc    API delete nutrition
// @route   /api/amdin/nutrition/

exports.deleteNutrition = async (req, res, next) => {
  try {
    const {json} = req.query;
    const nutrition = JSON.parse(json);
    await NutritionsSchema.deleteOne({_id: nutrition._id});
    const nutritions = await NutritionsSchema.find();
    res.json({success: true, data: nutritions});
  } catch (error) {
    res.json({success: false, error: error});
  }
}


