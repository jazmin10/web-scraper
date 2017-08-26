// Dependencies
var request = require("request");
var cheerio = require("cheerio");

// Requiring our models
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

// function finished(createRes, counter){
// 	console.log(counter)
// 	createRes.end()
// }

module.exports = function(app){

	// Grab home page with unsaved articles
	// /unsaved-articles
	app.get("/", function(readReq, readRes){

		// Find Articles where saved property is false
		Article.find({saved: false}, function(err, unsavedDoc){
			// console.log("new info:" + unsavedDoc);
			if(unsavedDoc.length === 0){
				readRes.render("index");
			}
			else {
				var unsavedObject = {articles: unsavedDoc}
				readRes.render("unsaved", unsavedObject);
			}
		});
	});

	// Grab saved articles
	app.get("/saved-articles", function(readReq, readRes){

		// Find query where saved property is true
		Article.find({saved: true}, function(err, savedDoc){
			var savedObject = {articles: savedDoc}
			readRes.render("saved", savedObject);
		});
	});

	// Route used to scrape website
	app.post("/scrape", function(createReq, createRes){

		var counter = 0;

		// Start scrape
		request("http://www.espnfc.us/", function(error, response, html){
			if (error) throw err;

			var $ = cheerio.load(html);

			var results = {};

			// Grab articles title and link
			$("div [alt=' TOP STORIES '] .grid-item-content .text-content").each(function(i, element){
				
				// Add title and link to results object
				results.title = $(element).children().find("a").text();
				results.link = $(element).children().find("a").attr("href");

				// Create new instance of Article Model
				var newArticle = new Article(results);

				// Save Article information to database
				newArticle.save(function(err, newDoc){
					if (err) return;
					counter++;
					// console.log(counter);
				});
			});
			
			// console.log(counter);
			// createRes.json({newArticles: counter});
		});
		// console.log(counter);
		// createRes.json({newArticles: counter});
		createRes.end();
	});

	// Save an article
	app.put("/save/:id", function(updateReq, updateRes){

		// Find article by id and update saved to true
		Article.findOneAndUpdate({_id: updateReq.params.id}, {saved: true}, {new: true})
		.exec(function(err, savedDoc){

			updateRes.json(savedDoc); // perhaps change to end
		});
	});

	// Remove an article from the saved list
	app.put("/unsave/:id", function(updateReq, updateRes){

		// Find article by id and update saved to false
		Article.findOneAndUpdate({_id: updateReq.params.id}, {saved: false}, {new: true})
		.exec(function(err, savedDoc){

			updateRes.json(savedDoc); // perhaps change to end
		});
	});

	// Add comment to an article
	app.post("/create-comment/:id", function(createReq, createRes){
		// console.log(typeof(JSON.parse(createReq.body)));
		// Create new instance of Comment Model
		var newComment = new Comment(createReq.body);

		// Add new comment to database
		newComment.save(function(err, newCommentDoc){
			if (err) throw err;

			// Add comment to article's list of comments
			Article.findOneAndUpdate({_id: createReq.params.id}, 
				{ $push: {comments: newCommentDoc._id}}, {new: true})
			.exec(function(error, doc){
				if (error) throw error;
			});

			createRes.json(newCommentDoc);
		});
	});

	// Grab an article's comments
	app.get("/comments/:id", function(readReq, readRes){

		// Find article by id and populate comments as well
		Article.findById(readReq.params.id).populate("comments")
		.exec(function(err, commentsDoc){
			if (err) throw err;

			readRes.json(commentsDoc);
		});
	});

	// Delete a comment
	app.delete("/delete-comment/:id", function(deleteReq, deleteRes){

		// Find article by id and remove from Comments Collection
		Comment.findByIdAndRemove(deleteReq.params.id).exec(function(err, removedDoc){
			// deleteRes.json(removedDoc);

			// Find article in which comment belongs to and remove from comments' list
			Article.findOneAndUpdate({comments: {$in: [deleteReq.params.id]}}, 
				{$pull: {comments: {$in: [deleteReq.params.id]}}}, {new: true})
			.exec(function(error, pullDoc){
				
				deleteRes.json(pullDoc);
			})
		});
	});


}