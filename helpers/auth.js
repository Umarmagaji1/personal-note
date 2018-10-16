module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error_msg", "Not Authorized You must Login first");
      res.redirect("/users/login");
    }
  }
};
