const express = require('express');
const router = express.Router();
const controller = require('../controller/admin_food');

router.route('/').get(controller.getProducts);
router.route('/').delete(controller.deleteProduct);

module.exports = router;