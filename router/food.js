const express = require('express');
const router = express.Router();

const controller = require('../controller/food');

router.route('/').get(controller.getFoods);
router.route('/market').get(controller.getFoodsMarket);
router.route('/ingredient').get(controller.getHintMenu);
router.route('/menu').get(controller.getFoodsMenu);
router.route('/menu/:key').get(controller.getDishesinMenu);
router.route('/special/menu/:type').get(controller.getSpecialMenu);
router.route('/cart').get(controller.getFoodHint);

module.exports = router;