const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override"); // untuk edit
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const User = require("./models/user");

const ExpressError = require("./utils/ExpressError");

process.noDeprecation = true;

// koneksi
mongoose
  .connect("mongodb://localhost:27017/yelpCamp")
  .then(() => console.log("Database Connection"));

app.engine("ejs", ejsMate); // dapat menggunakan <% layout('boilerplate') -%>
app.set("views", path.join(__dirname, "views")); // memberitahu express dimana letak template/tampilan website
app.set("view engine", "ejs"); // dapat menggunakan .ejs tanpa perlu ditulis lagi

app.use(express.urlencoded({ extended: true })); //perlu untuk ngepost
app.use(methodOverride("_method")); // untuk edit
app.use(express.static(path.join(__dirname, "public"))); // untuk dapat menggunakan assets statis seperti CSS, js,foto, audio, dll

const sessionConfig = {
  secret: "iniseharusnyamenjadirahasiaterbaik!",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1000 milidetik, 60 dtk, 60 mnt, 24 jam, 7 hari
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// menggunakan router
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// home
app.get("/", (req, res) => {
  res.render("home");
});

// menangani error
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("SERVING ON PORT 3000");
});
