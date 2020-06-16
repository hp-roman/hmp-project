const express = require('express');
const router = express.Router();
const controller = require('../controller/admin_nutrition');

router.route('/').get(controller.getNutritions);
router.route('/').delete(controller.deleteNutrition);
router.route('/').post(controller.addNutrition);
router.route('/').put(controller.updateNutrition);

module.exports = router;