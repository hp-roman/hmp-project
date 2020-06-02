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

// @desc    API update nutritions
// @route   /api/amdin/nutrition/update

exports.updateNutritions = async (req, res, next) => {
  try {
  } catch (error) {
    res.json({ success: false, error: error });
  }
};
