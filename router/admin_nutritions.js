const express = require('express');
const router = express.Router();
const controller = require('../controller/admin_nutritions');

router.route('/').get(controller.getNutritions);

module.exports = router;