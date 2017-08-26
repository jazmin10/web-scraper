/* MongoDB - Moongoose Web Scraper
Initialize routes */

// Dependencies
var request = require("request");
var cheerio = require("cheerio");

// Requiring our models
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

// Export routes to server.js
module.exports = function(app){

	// Displays main page with unsaved articles
	app.get("/", function(readReq, readRes){

		// Find articles that have not been saved
		Article.find({saved: false}, function(err, unsavedDoc){
			// If there are no articles, render index.handlebars
			if(unsavedDoc.length === 0){
				readRes.render("index");
			}
			// If there are articles, render unsaved.handlebars
			else {
				var unsavedObject = {articles: unsavedDoc}
				readRes.render("unsaved", unsavedObject);
			}
		});
	});

	// Display saved articles page
	app.get("/saved-articles", function(readReq, readRes){

		// Find articles that have been saved
		Article.find({saved: true}, function(err, savedDoc){

			// render saved.handlebars
			var savedObject = {articles: savedDoc}
			readRes.render("saved", savedObject);
		});
	});

	// Scrape website for new articles and add them to the database
	app.post("/scrape", function(createReq, createRes){

		// Request website for scraping
		request("http://www.espnfc.us/", function(error, response, html){
			if (error) throw err;

			var $ = cheerio.load(html);

			// Object that will be used to save documents into Articles collection
			var results = {};

			// Grab articles title and link from website
			$("div [alt=' TOP STORIES '] .grid-item-content .text-content").each(function(i, element){
				
				// Add title and link to results object
				results.title = $(element).children().find("a").text();
				results.link = $(element).children().find("a").attr("href");

				// Create new instance of Article Model
				var newArticle = new Article(results);

				// Save newArticle to database
				newArticle.save(function(err, newDoc){
					if (err) return;
				});
			});
		});
		
		// End the response process
		createRes.end();
	});

	// Save an article
	app.put("/save/:id", function(updateReq, updateRes){

		// Find article by id and update saved to true
		Article.findOneAndUpdate({_id: updateReq.params.id}, {saved: true}, {new: true})
		.exec(function(err, savedDoc){

			updateRes.json(savedDoc); 
			// this can be updateRes.end(), but left .json() for future dev
		});
	});

	// Remove an article from the saved list
	app.put("/unsave/:id", function(updateReq, updateRes){

		// Find article by id and update saved to false
		Article.findOneAndUpdate({_id: updateReq.params.id}, {saved: false}, {new: true})
		.exec(function(err, savedDoc){

			updateRes.json(savedDoc);
			// this can be updateRes.end(), but left .json() for future dev
		});
	});

	// Add comment to an article
	app.post("/create-comment/:id", function(createReq, createRes){
		
		// Create new instance of Comment Model
		var newComment = new Comment(createReq.body);

		// Add new comment to Comments collection
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

		// Find article by id and populate comments
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

			// Find article in which comment belongs to and remove from comments' list
			Article.findOneAndUpdate({comments: {$in: [deleteReq.params.id]}}, 
				{$pull: {comments: {$in: [deleteReq.params.id]}}}, {new: true})
			.exec(function(error, pullDoc){
				
				deleteRes.json(pullDoc);
			});
		});
	});
}