const express = require('express');
const router = express.Router();
const controller = require('../controller/admin_dish.js');

router.route('/').get(controller.getDishes);
router.route('/').delete(controller.deleteDish);
module.exports = router;