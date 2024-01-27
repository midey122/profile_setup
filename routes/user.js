const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const checkLog = require("../middleware/checkLog.js");
// const checkCookie = require("../middleware/checkCookie.js");

router.get("/login", (req, res) => {
  let usererror = req.query.usererr;
  let passerror = req.query.passerr;
  let err = { usererror, passerror };
  res.render("user/login",{err}); 
});

router.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let user = await User.findOne({ username });
  if (!user) return res.redirect("/user/login?usererr= invalid username");
  let check = await bcrypt.compare(password, user.password);
  if (!check) return res.redirect("/user/login?passerr=incorrect password");
  res.redirect("/");
});

module.exports = router;
