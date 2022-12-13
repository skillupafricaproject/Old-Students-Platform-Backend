const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authentication");
const {uploadImage} = require("../controller/uploadController")


const { getUser, getUserProfile } = require("../controller/userController");
const { updateUser } = require("../controller/userController");



router.route("/getuser/:id").post(authMiddleware, getUser);
router.route("/updateuser").post(authMiddleware, updateUser);
router.route('/uploads').post(uploadImage);
router.route('/getUserProfile/:id').get(getUserProfile)

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