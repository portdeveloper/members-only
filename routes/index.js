const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", (req, res) => {
  res.render("index", { title: "Members Only" });
});

//router.get("/signup", userController.getSignup);

module.exports = router;
