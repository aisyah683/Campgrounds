const { model } = require("mongoose");
const Campground = require("../models/campground");

// semua campground
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

// form tambah
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

// proses simpan data
module.exports.createCampground = async (req, res, next) => {
  // if (!req.body.campground) throw new ExpressError("Invalid Campgroung Data", 400);
  const campgrounds = new Campground(req.body.campground);
  campgrounds.author = req.user._id;
  await campgrounds.save();
  req.flash("success", "Successfully made a new campground!"); // pesan yang mau dikirim
  res.redirect(`/campgrounds/${campgrounds._id}`);
};

// show
module.exports.showCampground = async (req, res) => {
  const campgrounds = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  console.log(campgrounds);
  if (!campgrounds) {
    req.flash("error", "Cannot find that camground!"); // pesan yang mau dikirim
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campgrounds });
};

// form edit
module.exports.renderEditFrom = async (req, res) => {
  const { id } = req.params;
  const campgrounds = await Campground.findById(id);
  if (!campgrounds) {
    req.flash("error", "Cannot find that camground!"); // pesan yang mau dikirim
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campgrounds });
};

// proses update
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campgrounds = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campgrounds._id}`);
};

// proses hapus
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
