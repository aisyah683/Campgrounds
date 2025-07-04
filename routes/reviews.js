const express = require("express");
const router = express.Router({ mergeParams: true }); // untuk dapat mengambil isi dari /:id
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

// review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
