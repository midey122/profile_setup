const mongoose = require("mongoose");
const User = require("./model/user.js");

async function population() {
  mongoose.connect("mongodb://localhost:2701/profile-setupApp").then(() => {
    console.log("connect to database");
  });
  await User.updateMany(
    {},
    { $set: { profilePicture: "./images/default.png" } }
  );
    console.log("updated");
    mongoose.disconnect();
}
population();
