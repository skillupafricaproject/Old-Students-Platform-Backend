const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authentication");


const { getUser } = require("../controller/userController");

router.route("/getUserProfile").get(authMiddleware, getUser);

module.exports = router;









// const router = require('express').Router()
// const authController = require('../controller/authController')
// const userController = require('../controller/userController')
// //const { isResetTokenValid } = require('../middleware/user')

// router.post('/signup', authController.signup )
// router.post('/login', authController.login )

// router.post('/verify-email/:id', authController.verifyEmail)
// router.post('/forgotPassword', authController.forgotPassword)
// router.patch('/resetPassword/:token', authController.resetPassword)
// router.patch('/updateMyPassword', authController.protect, authController.updatePassword)
// router.patch('/updateMe', authController.protect, userController.updateMe)
// router.patch('/deleteMe', authController.protect, userController.deleteMe)
// router.get('/logout', authController.protect, authController.logout)

// router.get('/getUser',authController.protect, userController.getUser)


// module.exports = router