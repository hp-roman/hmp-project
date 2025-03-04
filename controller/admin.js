const jwt = require("jsonwebtoken");
const accessTokenSecret = "healthy-meal-planner";
const clone = require("../middleware/lotte");
const Catogory = require("../models/catogories");
const Dish = require("../models/dishes");
const Product = require('../models/products');

// desc     API login for admin
// route    /api/admin/login
// param    username, password

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.query;
    if (username === "admin" && password === "healthymealplanner") {
      const accessToken = jwt.sign(
        {
          username: username,
          exp: Math.floor(Date.now()) + 60 * 60,
        },
        accessTokenSecret
      );
      res.json({ success: true, token: accessToken });
    } else {
      res.json({ success: false, message: "Login failed" });
    }
  } catch (error) {}
};

// @desc    API clone lotte, update price for dishes, ...
// @route   /api/admin/updateall

exports.updateAll = async (req, res, next) => {
  try {
    // clone lotte
    const resources = await clone();
    // update id_catogory
    const catogories = await Catogory.find();
    const newResrouces = updateCatogory(resources, catogories);
    const dishes = await Dish.find();
    const newDishes = updateDish(dishes, newResrouces);
    if(resources){
      newDishes.map(async dish => {
        await Dish.updateOne({_id: dish._id}, dish);
      });
      await Product.deleteMany();
      await Product.insertMany(newResrouces);
    }


    res.json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

function updateDish(dishes, foods) {
  try {
    dishes.map((dish) => {
      foods.map((food) => {
        const lowerD = dish.main_ingredient.toLowerCase();
        const lowerF = food.name.toLowerCase();
        if (lowerF.includes(lowerD)) {
          dish.price = food.price;
          dish.id_catogory = food.id_catogory;
          return;
        } else {
          const lowerDs = lowerD.split(",") || [];
          if (lowerDs !== []) {
            lowerDs.map((value) => {
              if (lowerF.includes(value)) {
                dish.price = food.price;
                dish.id_catogory = food.id_catogory;
                return;
              }
            });
          }
        }
      });
    });
    return dishes;
  } catch (error) {
    console.log(error);
  }
}

function updateCatogory(resource, cagotory) {
  const rsP = getResourceType(resource, "protein");
  const rsM = getResourceType(resource, "mineral");
  const rsG = getResourceType(resource, "glucid");
  const cgP = getResourceType(cagotory, "protein");
  const cgM = getResourceType(cagotory, "mineral");
  const cgG = getResourceType(cagotory, "glucid");
  const rstP = addCatogoryId(rsP, cgP);
  const rstM = addCatogoryId(rsM, cgM);
  const rstG = addCatogoryId(rsG, cgG);
  return [...rstP, ...rstM, ...rstG];
}

function getResourceType(resource, type) {
  const result = [];
  resource.map((value) => {
    if (value.type === type) {
      result.push(value);
    }
  });
  return result;
}

function addCatogoryId(foods, catogories) {
  foods.map((food) => {
    catogories.forEach((cato, pos) => {
      const lowerF = food.name.toLowerCase();
      const lowerC = cato.name.toLowerCase();
      if (lowerF.includes(lowerC)) {
        food.id_catogory = cato._id;
        return;
      } else {
        const lowerCs = lowerC.split(" ");
        lowerCs.map((value) => {
          if (lowerF.includes(value)) {
            food.id_catogory = cato._id;
            return;
          }
        });
      }
    });
  });
  return foods;
}
