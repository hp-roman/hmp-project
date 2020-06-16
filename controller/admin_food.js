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