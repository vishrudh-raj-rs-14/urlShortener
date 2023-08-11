const asyncHandler = require("express-async-handler");
const Url = require("../models/urlModel");
const axios = require("axios");

function validateString(inputString) {
  const pattern = /^[a-zA-Z0-9\-_]+$/;

  if (pattern.test(inputString)) {
    return true;
  } else {
    return false;
  }
}

exports.shortendUrl = asyncHandler(async (req, res) => {
  if (!validateString(req.body.shortenedUrl)) {
    res.status(401);
    throw new Error("Invalid New Url");
  }
  const newUrl = await Url.create({
    user: req.user._id,
    oldUrl: req.body.url,
    newUrl: req.body.shortenedUrl,
  });
  // let ip = req.socket.remoteAddress;
  // console.log(req.ip);
  // console.log(ip);
  res.status(200).json({
    status: "success",
    newUrl,
  });
});

exports.getMyUrls = asyncHandler(async (req, res) => {
  const myUrls = await Url.find({ user: req.user._id });
  res.status(200).json({
    status: "success",
    myUrls,
  });
});

exports.redirectTo = asyncHandler(async (req, res) => {
  const url = await Url.findOne({ newUrl: req.params.url });

  if (!url) {
    res.status(404).json({
      status: "fail",
      message: "Url not found",
    });
  }
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if ((ip = "::1")) {
    ip = "106.195.38.29";
  }
  const location = await axios.get(`https://ipapi.co/${ip}/json/`);
  originalLocation = url.location || {};
  if (originalLocation[location.data.country_name]) {
    originalLocation[location.data.country_name] += 1;
  } else {
    originalLocation[location.data.country_name] = 1;
  }
  const data = await Url.findOneAndUpdate(
    { newUrl: req.params.url },
    {
      $set: {
        location: originalLocation,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    url,
  });
});
