const User = require("../models/user");

// form register
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

// proses register
module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

// form login
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

// proses login
module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

// proses logout
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
