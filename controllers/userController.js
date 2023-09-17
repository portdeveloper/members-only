const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.getSignup = (req, res) => {
  res.render("signup");
};

exports.postSignup = async (req, res) => {
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.redirect("/signup");
  }
};

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
});
