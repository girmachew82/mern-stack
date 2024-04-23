const express = require('express')
const router = express.Router()
const authController = require('../controllers/authControllers')
const loginLimiter = require('../middleware/loginLimiter')
router.route('/')
    .post(authController.login)
router.route('/referesh')
    .get(authController.refresh)
router.route('/logout')
    .post(authController.logout)


module.exports = router