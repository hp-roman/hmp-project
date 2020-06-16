const express = require('express');
const router = express.Router();
const controller = require('../controller/admin_menu');

router.route('/').get(controller.getMenus);
router.route('/').delete(controller.deleteMenu);


module.exports = router;