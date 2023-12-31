const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.getSignup = (req, res) => {
  res.render("signup");
};

exports.signupValidations = [
  check("firstName")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("First Name is required"),
  check("lastName")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Last Name is required"),
  check("email").isEmail().normalizeEmail().withMessage("Invalid Email"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters"),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Confirm Password does not match password");
    }
    return true;
  }),
];

exports.postSignup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
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

exports.getJoinClub = (req, res) => {
  res.render("join-club");
};

exports.postJoinClub = async (req, res) => {
  const { passcode } = req.body;

  if (passcode === process.env.SECRET_PASSCODE) {
    req.user.membership = "access";
    await req.user.save();
    res.redirect("/");
  } else {
    res.redirect("/join-club");
  }
};

exports.getAdminLogin = (req, res) => {
  res.render("admin-login");
};

exports.postAdminLogin = async (req, res) => {
  const { passcode } = req.body;

  if (passcode === process.env.ADMIN_PASSCODE) {
    req.user.membership = "admin";
    await req.user.save();
    res.redirect("/");
  } else {
    res.redirect("/admin-login");
  }
};
