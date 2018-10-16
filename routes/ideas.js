const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");

//connect model
require("../model/Idea");
const Idea = mongoose.model("ideas");

//get add route
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

//get ideas route
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

//post add process
router.post("/", ensureAuthenticated, (req, res) => {
  const newUser = {
    title: req.body.title,
    details: req.body.details,
    user: req.user.id
  };
  new Idea(newUser)
    .save()
    .then(idea => {
      req.flash("success_msg", "Idea Added");
      res.redirect("/ideas");
    })
    .catch(err => console.log(err));
});

//load edit form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash("error_msg", "Not Authorized");
      res.redirect("/users/login");
    } else {
      res.render("ideas/edit", {
        idea: idea
      });
    }
  });
});

//Edit idea PUT
router.put("/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    (idea.title = req.body.title), (idea.details = req.body.details);
    idea.save().then(() => {
      req.flash("success_msg", "Idea Updated");
      res.redirect("/ideas");
    });
  });
});

//delete idea DELETE
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Idea removed");
    res.redirect("/ideas");
  });
});

module.exports = router;
