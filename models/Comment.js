/* MongoDB - Moongoose Web Scraper
Initializes mongoose Comment model */

// Require mongoose
var mongoose = require("mongoose");

// Create Schema class
var Schema = mongoose.Schema;

// Create a CommentSchema with the Schema class
var CommentSchema = new Schema({
  body: {
    type: String
  }
});

var Comment = mongoose.model("Comment", CommentSchema);

// Export the model
module.exports = Comment;