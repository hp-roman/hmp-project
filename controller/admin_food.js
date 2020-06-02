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