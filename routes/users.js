const express         = require('express')
const router          = express.Router()
const userController  = require('../controllers/user')

router.post('/login', userController.postUserLogin)
router.post('/login-facebook', userController.postUserLoginFacebook)
router.post('/register', userController.postUserRegister)

module.exports = router
