// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// app.use(bodyParser.urlencoded({
//   extended: false
// }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Make public a static dir
app.use(express.static("public"));

// Set handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Local database configuration with mongoose
// mongoose.connect("mongodb://localhost/webscraper");

// Heroku database configuration with mongoose
// MONGODB_URI: mongodb://heroku_6zrbp5df:ktclkc67kco9s93kgrj9597a2k@ds161493.mlab.com:61493/heroku_6zrbp5df
mongoose.connect("mongodb://heroku_6zrbp5df:ktclkc67kco9s93kgrj9597a2k@ds161493.mlab.com:61493/heroku_6zrbp5df");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Requiring our routes
require("./routes/api-routes.js")(app);

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port 3000!");
});