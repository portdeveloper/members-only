const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", (req, res) => {
  res.render("index", { title: "Members Only" });
});

router.get("/signup", userController.getSignup);
router.post("/signup", userController.postSignup);

router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);

module.exports = router;
