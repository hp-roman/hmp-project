const express = require('express');
const router = express.Router();
const controller = require('../controller/statistic');

router.route('/:token').get(controller.getStatistic);

module.exports = router;