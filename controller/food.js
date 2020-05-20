const ProductSchema = require("../models/products");
const MenuSchema = require("../models/menu");
const dishFunc = require("../middleware/dish");
const DishSchema = require("../models/dishes");
const CatogorySchema = require("../models/catogories");
// @desc    API get material food following price [method:GET]
// @route   /api/foods/?type=?&price=?

exports.getFoods = async (req, res, next) => {
  const { type, price } = req.query;
  try {
    let foods;
    if (!price && type) {
      foods = await ProductSchema.find({
        type: type,
      });
    }
    if (price && type) {
      foods = await ProductSchema.find({
        type: type,
        price: {
          $lte: price,
        },
      });
    }
    if (!price && !type) {
      res.status(200).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: foods,
    });
  } catch (error) {}
};

// @desc    API get menu food
// @route   /api/foods/menu

exports.getFoodsMenu = async (req, res, next) => {
  try {
    const menus = await MenuSchema.find();
    const menumap = await Promise.all(
      menus.map(async (menu) => {
        let message = "";
        let price = 0;
        const dishes = await DishSchema.find({ menu: menu.key });
        for (const dish of dishes) {
          if (dish.price != undefined) {
            price += dish.price;
          } else {
            message += `${dish.name}, `;
          }
        }
        if (message != "") {
          message = "Giá không bao gồm: " + message;
        }
        menu.message = message;
        menu.price = price.toFixed(1);
        return menu;
      })
    );
    res.status(200).json({
      success: true,
      data: menumap,
    });
  } catch (error) {}
};

// @desc    API get food of a menu
// @route   /api/foods/menu/:key

exports.getDishesinMenu = async (req, res, next) => {
  try {
    const { key } = req.params;
    const dishes = await DishSchema.find({
      menu: key,
    });
    res.status(200).json({
      success: true,
      data: dishes,
    });
  } catch (error) {}
};

// @desc    API get menu special food
// route    /api/foods/special/menu/:type

exports.getSpecialMenu = async (req, res, next) => {
  try {
    const { type } = req.params;
    const specialMenu = await MenuSchema.find({
      isSpecial: true,
      kindOf: type,
    });
    res.status(200).json({
      success: true,
      data: specialMenu,
    });
  } catch (error) {}
};

// @desc    API get food for going to market
// route    /api/foods/market

exports.getFoodsMarket = async (req, res, next) => {
  try {
    const foods = await ProductSchema.find();
    res.status(200).json({
      success: true,
      data: foods,
    });
  } catch (error) {}
};

// @desc API return a menu with material food choosen
// /api/foods/ingredient/?select=?,?

exports.getHintMenu = async (req, res, next) => {
  try {
    const { select } = req.query;
    const products = await ProductSchema.find({
      $or: [{ _id: select.split(",") }],
    });
    const dishes = await DishSchema.find();
    const dishesMapped = [];
    for (const food of products) {
      for (const dish of dishes) {
        const foodLower = food.name.toLowerCase().trim();
        const dishLower = dish.main_ingredient.toLowerCase().trim();
        const main = dishLower.split(',') || [];
        if(main != []){
          for(const t of main){
            if (foodLower.includes(t)) {
              dishesMapped.push(dish);
              break;
            }
          }
        }else {
          if (foodLower.includes(t)) {
            dishesMapped.push(dish);
          }
        }
        
      }
    }
    res.json({
      data: dishesMapped,
    });
  } catch (error) {}
};
//
exports.getFoodHint = async (req, res, next) => {
  var { select } = req.query;
  var cart = select.split(",") || [];
  //   req.session.cart = cart;
  const products = (await ProductSchema.find({ _id: { $in: cart } })) || [];
  const id_catogory = [];
  products.map((value) => {
    if (value.id_catogory != "") {
      id_catogory.push(value.id_catogory);
    }
  });
  const catogories = await CatogorySchema.find({
    _id: { $in: id_catogory },
  }).lean();
  let names = "";
  const catogoryNames = await catogories.map((c) => {
    names = "" + c.name;
    return c.name;
  });
  let dishes = await DishSchema.find();
  let dishesSelect = [];
  const capitalize = (s) => {
    return s && s[0].toUpperCase() + s.slice(1);
  };
  dishes.map((d) => {
    let dNames = [];
    dNames = d.main_ingredient.split(" ");
    dNames.map((n) => {
      if (catogoryNames.includes(capitalize(n))) {
        dishesSelect.push(d);
        return;
      }
    });
  });
  return res.json(dishesSelect);
};
