const express = require('express');
const router = express.Router();
const controller = require('../controller/admin_food');

router.route('/').get(controller.getProducts);

module.exports = router;