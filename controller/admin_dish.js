const Dish = require("../models/dishes");

// @desc    API get all dishes
// @route   /api/admin/dish

exports.getDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find();
    res.json({ success: true, data: dishes });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

// @desc    API delete dish
// @route   /api/admin/dish [DELETE]

exports.deleteDish = async (req, res, next) => {
  try {
    const { json } = req.query;
    const dish = JSON.parse(json);
    await Dish.deleteOne({ _id: dish._id });
    const dishes = await Dish.find();
    res.json({ success: true, data: dishes });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};
