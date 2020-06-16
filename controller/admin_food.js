const Product = require('../models/products');

// @desc    API get all product
// @route   /api/admin/food

exports.getProducts = async (req, res, next) => {

    try {
        const products = await Product.find();
        res.json({success: true, data: products});
    } catch (error) {
        res.json({success: false, error: error});
    }
}

// @desc    API delete product
// @route   /api/admin/food

exports.deleteProduct = async (req, res, next) => {
    try {
       const {json} = req.query;
       const food = JSON.parse(json);
       await Product.deleteOne({_id: food._id});
       const foods = await Product.find();
       res.json({success: true, data: foods}); 
    } catch (error) {
        res.json({success: false, error: error});
    }
}

// @desc    API add food
// @route   /api/admin/food [POST]

exports.addFood = async (req, res, next) => {
    try {
      const {json} = req.query;
      const food = JSON.parse(json);
      if(isNaN(food.price)){
        food.price = 0;
      } else {
        food.price = parseFloat(food.price);
      }
      await Product.create(food);
      const foods = await Product.find();
      res.json({success: true, data: foods});
    } catch (error) {
      res.json({success: false, error: error});
    }
  }
  
  // @desc    API update food
  // @route   /api/admin/food [PUT]
  
  exports.updateFood = async (req, res, next) => {
    try {
      const {json, json2} = req.query;
      const newFood = JSON.parse(json);
      const oldFood = JSON.parse(json2);
      
      if(isNaN(newFood.price)){
        newFood.price = 0;
      } else {
        newFood.price = parseFloat(newFood.price);
      }
      await Product.updateOne({_id: oldFood._id}, newFood);
      const foods = await Product.find();
      res.json({success: true, data: foods});
    } catch (error) {
      res.json({success: false, error: error});
    }
  }