const HistorySchema = require("../models/history");
const DishSchema = require("../models/dishes");
const UserSchema = require("../models/user");
const StatisticSchema = require("../models/statistic");
const CatogorySchema = require('../models/catogories');
const NutritionSchema = require('../models/nutritions');

// desc     api for viewing a dish
// route    /api/history/?id=&token=

exports.viewDish = async (req, res, next) => {
  try {
    const { id, token } = req.query;
    const history = await HistorySchema.findOne({
      id_dish: id,
      token: token,
    });
    if (history) {
      history.view = history.view + 1;
      await HistorySchema.update(
        {
          _id: history._id,
        },
        history
      );
    } else {
      await HistorySchema.create({
        id_dish: id,
        view: 1,
        token: token,
      });
    }
    const dish = await DishSchema.findOne({_id: id});
      if(dish.id_catogory){
        const user = await UserSchema.findOne({token: token});
        const statistic = await StatisticSchema.findOne({_id: user.id_statistic});
        const catogory = await CatogorySchema.findOne({_id: dish.id_catogory});
        const nutrition = await NutritionSchema.findOne({_id: catogory.id_nutrition});
        statistic.protein += nutrition.protein;
        statistic.lipid += nutrition.lipid;
        statistic.glucid += nutrition.glucid;
        await StatisticSchema.updateOne({_id: statistic._id}, statistic); 
      }
    res.json({ success: true, message: "Created history" });
  } catch (error) {}
};

// desc   API for get history
// route  /api/history/view/:token

exports.viewHistory = async (req, res, next) => {
  try {
    const { token } = req.params;
    const history = await HistorySchema.find({ token: token }).sort({
      view: -1,
    });
    const ids = [];
    history.map((value) => {
      ids.push(value.id_dish);
    });
    const dishes = await DishSchema.find({ $or: [{ _id: ids }] });
    res.json({
      success: true,
      data: dishes,
    });
  } catch (error) {}
};
