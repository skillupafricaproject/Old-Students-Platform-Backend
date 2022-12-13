const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authentication");

const {
    signup,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
} = require("../controller/authController");

router.route("/signup").post(signup);
router.route("/verify-email/:id").post(verifyEmail);
router.route("/login").post(authMiddleware, login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/logout").post(logout);

module.exports = router;