const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const passport = require("passport");
// init express
const app = express();

// import database config file incase of production and local testing
const db = require("./config/database");
//connect mongodb
mongoose
  .connect(
    db.mongoURI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("mongodb connected"))
  .catch(err => console.log(err));

//use body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connect path
app.use(express.static(path.join(__dirname, "public")));

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//connect flash
app.use(flash());

// method override middleware
app.use(methodOverride("_method"));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.user = req.user || null;
  res.locals.error = req.flash("error");
  next();
});

//connect express handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//bring in passport
require("./config/passport")(passport);

//connect routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

//define port
const port = process.env.PORT || 5000;

//home route
app.get("/", (req, res) => {
  const title = "Welcome to Vidjot Project";
  res.render("home", {
    title: title
  });
});

//about route
app.get("/about", (req, res) => {
  const title = "About Page";
  res.render("about", {
    title: title
  });
});

//initialize routes
app.use("/ideas", ideas);
app.use("/users", users);

//init app
app.listen(port, () => {
  console.log(`app started on port ${port}`);
});
