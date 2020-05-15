const express = require('express');
const router = express.Router();
const controller = require('../controller/history');

router.route('/').get(controller.viewDish);
router.route('/view/:token').get(controller.viewHistory);


module.exports = router;