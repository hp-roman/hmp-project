const express = require('express');
const router = express.Router();
const controller = require('../controller/admin_nutrition');

router.route('/').get(controller.getNutritions);
router.route('/').delete(controller.deleteNutrition);

module.exports = router;