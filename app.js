const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const app = express();
const mongoose = require("mongoose");
const routes = require("./routes/index");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");

app.use(
  session({
    secret: "someRandomSecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) return done(null, false, { message: "Incorrect email." });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
          return done(null, false, { message: "Incorrect password." });

        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});

app.use("/", routes);
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
