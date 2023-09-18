const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");
const Message = require("../models/message");

router.get("/", async (req, res) => {
  try {
    const messages = await Message.find({}).sort("-date").populate("user");
    res.render("index", {
      title: "Your Title",
      messages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
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

router.get("/admin-login", ensureAuthenticated, userController.getAdminLogin);
router.post("/admin-login", userController.postAdminLogin);

router.get("/messages/new", messageController.getNewMessage);
router.post("/messages/new", messageController.postNewMessage);

router.post("/messages/:id/delete", messageController.deleteMessage);

module.exports = router;
