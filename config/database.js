if (process.env.NODE_ENV === "production") {
  module.exports = {
    //incase of production
    mongoURI: "" //your production mongouri
  };
} else {
  //incase of local testing
  module.exports = {
    mongoURI: "mongodb://localhost/vidjot" //your local mongodb uri on your machine
  };
}
