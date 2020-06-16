const express = require('express');
const router = express.Router();
const controller = require('../controller/admin_user');

router.route('/').get(controller.getUsers);
router.route('/').delete(controller.deleteUser);
router.route('/').post(controller.addUser);
router.route('/').put(controller.updateUser);


module.exports = router;