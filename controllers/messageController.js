const Message = require("../models/message");

exports.getNewMessage = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("new-message");
};

exports.postNewMessage = async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  try {
    const message = new Message({
      title: req.body.title,
      content: req.body.content,
      user: req.user,
    });
    await message.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
