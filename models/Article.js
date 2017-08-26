/* MongoDB - Moongoose Web Scraper
Initializes mongoose Article model */

// Require mongoose
var mongoose = require("mongoose");

// Create Schema class
var Schema = mongoose.Schema;

// Create a ArticleSchema with the Schema class
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
  	type: String,
  	required: true

  },
  saved: {
  	type: Boolean,
  	default: false
  },
  // comments property for the Article
  comments: [{
    // Store ObjectIds in the array
    type: Schema.Types.ObjectId,
    // The ObjectIds will refer to the ids in the Comment model
    ref: "Comment"
  }]
});

var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;