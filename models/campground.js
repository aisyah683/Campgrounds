const mongoose = require("mongoose");
const Review = require("./review");

const campgroundSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  // Fungsi ini akan dijalankan setelah Model.findOneAndDelete() berhasil dijalankan
  if (!doc) return; // Jika tidak ditemukan dokumen (doc === null), kita hentikan di sini.
  await Review.deleteMany({ _id: { $in: doc.reviews } }); // ini akan menghapus sesuai dengan `_id`-nya yang ada di dalam doc.reviews
});

module.exports = mongoose.model("Campground", campgroundSchema);
