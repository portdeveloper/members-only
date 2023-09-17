const User = require("../models/user");
const Message = require("../models/message");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().populate("user").exec();
  res.render("index", { title: "Mini Messageboard", messages });
});
