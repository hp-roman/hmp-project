const express = require('express');
const router = express.Router();
const controller = require('../controller/user');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/change', controller.changePassword);
router.post('/forget', controller.forgetPassword);
router.get('/reset', controller.resetPassword);
router.get('/feedback', controller.feedback);

module.exports = router;
