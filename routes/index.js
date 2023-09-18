const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

router.get("/", (req, res) => {
  res.render("index", { title: "Members Only" });
});

router.get("/signup", userController.getSignup);
router.post(
  "/signup",
  userController.signupValidations,
  userController.postSignup
);

router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

router.get("/join-club", ensureAuthenticated, userController.getJoinClub);
router.post("/join-club", userController.postJoinClub);

router.get("/messages/new", messageController.getNewMessage);
router.post("/messages/new", messageController.postNewMessage);

module.exports = router;
