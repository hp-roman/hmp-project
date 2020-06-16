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
// @desc    API add dish
// @route   /api/admin/dish [POST]

exports.addDish = async (req, res, next) => {
  try {
    const {json} = req.query;
    const dish = JSON.parse(json);
    if(isNaN(dish.price)){
      dish.price = 0;
    }
    else {
      dish.price = parseFloat(dish.price);
    }
    await Dish.create(dish);
    const dishes = await Dish.find();
    res.json({success: true, data: dishes});
  } catch (error) {
    res.json({success: false, error: error});
  }
}

// @desc    API update dish
// @route   /api/admin/dish [PUT]

exports.updateDish = async (req, res, next) => {
  try {
    const {json, json2} = req.query;
    const newDish = JSON.parse(json);
    const oldDish = JSON.parse(json2);
    if(isNaN(newDish.price)){
      newDish.price = 0;
    }
    else {
      newDish.price = parseFloat(newDish.price);
    }
    await Dish.updateOne({_id: oldDish._id}, newDish);
    const dishes = await Dish.find();
    res.json({success: true, data: dishes});
  } catch (error) {
    res.json({success: false, error: error});
  }
}
