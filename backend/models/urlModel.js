const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validators = require("validator");

const urlSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please mention url creator"],
  },
  oldUrl: {
    type: String,
    required: [true, "Old url is compulsory"],
  },

  newUrl: {
    type: String,
    unique: true,
    required: [true, "New url is compulsory"],
  },
});

const Url = mongoose.model("Url", urlSchema);
module.exports = Url;
