const express = require('express');
const router = express.Router();
const controller = require('../controller/admin');

router.route('/login').post(controller.login);
router.route('/updateall').get(controller.updateAll);

module.exports = router;