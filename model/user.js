const mongoose = require("mongoose");
const express = require("express");

const userSchema = mongoose.Schema(
  {
    profilePicture: String,
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
    },
    age: Number,
    email: {
      type: String,
      require: true,
      unique: true,
    },
    gender: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
