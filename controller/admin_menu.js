const DishSchema = require("../models/dishes");
const ProductSchema = require("../models/products");
const MenuSchema = require("../models/menu");
const CatagorySchema = require("../models/catogories");
const HistorySchema = require('../models/history')
exports.test = async (req, res, next) => {
  try {
    const dishes = await DishSchema.find();
    dishes.map(vl => {
      vl.main_ingredient.match(/[]/,gi);
    });
    const history = await HistorySchema.find().sort({view: -1});
    res.json({data: history});
  } catch (error) {}
};


// const { select } = req.query;
    // console.log(select);
    // const products = await ProductSchema.find({ $or: [{ _id: select.split(',') }] });
    // const id_catogory = [];
    //  products.map(value => {
    //     if(value.id_catogory.length != 0){
    //         id_catogory.push(value.id_catogory);
    //     }
    //  });
    //  const catogories = await CatagorySchema.find({$or : [{_id: id_catogory}]});
    //  const name_catogory = [];
    //  catogories.map(value => {
    //     name_catogory. push(value.name);
    //  });
    //  const dishes = await DishSchema.find();
    //  const dishesMapped = [];
    //  dishes.map(dish => {
    //     name_catogory.map(name => {
    //         if(dish.name.includes(name)){
    //             dishesMapped.push(dish);
    //         }
    //     });
    //  });

    // res.json({
    //     data: dishesMapped
    // });