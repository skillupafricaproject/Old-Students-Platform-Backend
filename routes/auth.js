const express = require("express");

const router = express.Router();

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
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/logout").delete(logout);

module.exports = router;