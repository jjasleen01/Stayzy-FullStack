const express = require("express");

const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({mergeParams: true });
const passport= require("passport");
const { saveRedirectUrl } = require("../middleware");

const userControllers = require("../controllers/user.js");

//signup route
router.get("/signup", userControllers.signupForm);
router.post("/signup", wrapAsync(userControllers.signup));

//login route
router.get("/login" , userControllers.renderLoginForm);
router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), userControllers.login);

//logout route
router.get("/logout", userControllers.logout);

module.exports = router;