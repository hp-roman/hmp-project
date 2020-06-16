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

// @desc    API add nutrition
// @route   /api/admin/nutrition [POST]

exports.addNutrition = async (req, res, next) => {
  try {
    const {json} = req.query;
    const nutrition = JSON.parse(json);
    const isNotNumber = isNaN(nutrition.protein) && isNaN(nutrition.lipid) && isNaN(nutrition.glucid) && isNaN(nutrition.kcal);
    if(isNotNumber){
      nutrition.protein = 0;
      nutrition.lipid = 0;
      nutrition.glucid = 0;
      nutrition.kcal = 0;
    } else {
      nutrition.protein = parseFloat(nutrition.protein);
      nutrition.lipid = parseFloat(nutrition.lipid);
      nutrition.glucid = parseFloat(nutrition.glucid);
      nutrition.kcal = parseFloat(nutrition.kcal);
    }
    await NutritionsSchema.create(nutrition);
    const nutritions = await NutritionsSchema.find();
    res.json({success: true, data: nutritions});
  } catch (error) {
    res.json({success: false, error: error});
  }
}

// @desc    API update nutrition
// @route   /api/admin/nutrition [PUT]

exports.updateNutrition = async (req, res, next) => {
  try {
    const {json, json2} = req.query;
    const newNutrition = JSON.parse(json);
    const oldNutrition = JSON.parse(json2);
    const isNotNumber = isNaN(newNutrition.protein) && isNaN(newNutrition.lipid) && isNaN(newNutrition.glucid) && isNaN(newNutrition.kcal);
    if(isNotNumber){
      newNutrition.protein = 0;
      newNutrition.lipid = 0;
      newNutrition.glucid = 0;
      newNutrition.kcal = 0;
    } else {
      newNutrition.protein = parseFloat(newNutrition.protein);
      newNutrition.lipid = parseFloat(newNutrition.lipid);
      newNutrition.glucid = parseFloat(newNutrition.glucid);
      newNutrition.kcal = parseFloat(newNutrition.kcal);
    }
    await NutritionsSchema.updateOne({_id: oldNutrition._id}, newNutrition);
    const nutritions = await NutritionsSchema.find();
    res.json({success: true, data: nutritions});
  } catch (error) {
    res.json({success: false, error: error});
  }
}


