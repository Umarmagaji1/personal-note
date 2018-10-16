const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

//connect model
require("../model/User");
const User = mongoose.model("users");

// get login form
router.get("/login", (req, res) => {
  res.render("users/login");
});

// get register form
router.get("/register", (req, res) => {
  res.render("users/register");
});

//login process route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//process register route
router.post("/register", (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({ text: "passwords do not match" });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: "password must be atleast 4 characters" });
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    User.findOne({
      email: req.body.email
    }).then(email => {
      if (email) {
        req.flash("error_msg", "email already registered");
        res.redirect("/users/login");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "you are now registered and can login"
                );
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/users/login");
});

module.exports = router;
