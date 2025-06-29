const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schema");
const Campground = require("./models/campground");
const Review = require("./models/review");

// untuk memastikan sudah login atau ga
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl; // add this line
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

// untuk melanjutkan ke halaman yang akan dituju, dan agar tidak kembali lagi ke halaman awal
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// untuk memvalidasi inputan agar sesuai dengan schema
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// untuk memvalidasi inputan agar sesuai dengan schema
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// untuk mengecek apakah author atau bukan
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campgrounds = await Campground.findById(id);
  if (!campgrounds.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
