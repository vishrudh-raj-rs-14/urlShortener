const asyncHandler = require("express-async-handler");
const Url = require("../models/urlModel");

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
  res.status(200).json({
    status: "success",
    url,
  });
});
