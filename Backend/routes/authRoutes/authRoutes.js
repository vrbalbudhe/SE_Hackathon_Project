const express = require("express");
const passport = require("passport");

const { login } = require("../../controllers/authControllers/user/login");
const { register } = require("../../controllers/authControllers/user/register");
const { logout } = require("../../controllers/authControllers/user/logout");
const TokenVerification = require("../../controllers/authControllers/user/tokenVerify");
const { googleAuthCallback } = require("../../controllers/authControllers/user/googleAuth");

const router = express.Router();

// USER REGISTRATION ROUTE
router.post("/register", register);

// USER LOGIN ROUTE
router.post("/login", login);

// USER LOGOUT ROUTE
router.post("/logout", logout);

// USER TOKEN VERIFICATION
router.get("/isToken", TokenVerification);

// GOOGLE OAUTH ROUTES
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth" }),
  googleAuthCallback
);

module.exports = router;
