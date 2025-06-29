const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const user = require("../models/user");

router
  .route("/register")
  .get(users.renderRegister) // ke halaman register
  .post(catchAsync(users.register)); // proses register

router
  .route("/login")
  .get(users.renderLogin) // ke halaman login
  .post(
    // proses login
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

// logout
router.get("/logout", users.logout);

module.exports = router;
