const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

router
  .route("/")
  .get(catchAsync(campgrounds.index)) // all campgrounds
  .post(
    // proses tambah
    isLoggedIn,
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

// ke halaman tambah
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground)) // ke halaman show
  .put(
    // proses update
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(
    // proses delete
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.deleteCampground)
  );

// ke halaman edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditFrom)
);

module.exports = router;
