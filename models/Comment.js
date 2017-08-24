// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create a ArticleSchema with the Schema class
var CommentSchema = new Schema({
  // name: a unique String
  body: {
    type: String
    // required: true
  }
});

var Comment = mongoose.model("Comment", CommentSchema);

// Export the model
module.exports = Comment;