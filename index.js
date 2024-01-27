const express = require("express");
const bodyparser = require("body-parser");
const User = require("./model/user.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const { log } = require("console");
dotenv.config();
const userrouter = require("./routes/user.js");

const db_url = process.env.DB_URL;
const port = process.env.PORT;
const app = express();
app.use(express.static("assets"));
app.use(express.static("images"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.set("view engine", "ejs");

app.use("/user", userrouter);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + "_" + Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("profilePicture");

app.get("/", async (req, res) => {
  let allusers = await User.find();
  res.render("index", { allusers: allusers });
});

app.get("/addUser", (req, res) => {
  res.render("addUser");
});

app.get("/delete/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let user = await User.findOneAndDelete({ _id: id });
    let profilePicture = user.profilePicture;
    if (user) console.log("user deleted");
    else console.log("user not found");
    if (profilePicture) {
      fs.unlinkSync(`./images/${profilePicture}`);
    }
  } catch (error) {
    console.log("error deleting user");
  }

  res.redirect("/");
});

app.get("/update/:id", async (req, res) => {
  let id = req.params.id;
  let user = await User.findOne({ _id: id });
  console.log(user);
  res.render("update", { user });
});

app.post("/updateUser", upload, async (req, res) => {
  let { id, name, age, gender, email } = req.body;
  let user = await User.findOne({ _id: id });

  if (user) {
    user.name = name;
    user.age = age;
    user.gender = gender;
    user.email = email;
    if (req.file) {
      let oldpic = user.profilePicture;
      user.profilePicture = req.file.filename;
      if (oldpic !== "default.png" && oldpic) {
        fs.unlinkSync(`./images/${oldpic}`);
      }
    }
    user.save().then(() => {
      console.log("user updated successfully");
    });
  }
  console.log(user);
  res.redirect("/");
});

app.post("/addUser", upload, async (req, res) => {
  try {
    let { username, age, email, gender, password } = req.body;
    let hashpassword = await bcrypt.hash(password, 10);
    password = hashpassword;
    const newuser = new User({ username, age, email, gender, password });
    if (req.file) {
      newuser.profilePicture = req.file.filename;
    } else {
      newuser.profilePicture = "default.png";
    }
    await newuser.save().then(() => {
      console.log("user created ");
    });
  } catch (error) {
    console.log("error adding new user " + error);
  }
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
  mongoose.connect(db_url).then(() => {
    console.log("Connected to MongoDB");
  });
});
