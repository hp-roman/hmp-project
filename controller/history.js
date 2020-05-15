const HistorySchema = require("../models/history");
const DishSchema = require("../models/dishes");
const UserSchema = require("../models/user");

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
      return res.json({
        message: "Viewed",
      });
    } else {
      await HistorySchema.create({
        id_dish: id,
        view: 1,
        token: token,
      });
      return res.json({
        message: "Added",
      });
    }
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
