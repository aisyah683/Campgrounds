const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
  .connect("mongodb://localhost:27017/yelpCamp")
  .then(() => console.log("Database Connection"));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "685e340a0c0b0d4fe3dffcc8",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: `https://picsum.photos/400?random=${Math.random()}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo dicta fugiat sed quis fuga, optio eligendi eos qui saepe, eaque ea accusantium molestiae iusto repudiandae assumenda nihil voluptatem omnis modi.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => mongoose.connection.close());
