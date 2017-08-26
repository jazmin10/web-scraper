/* MongoDB - Moongoose Web Scraper
Functionality for saved articles page */

$(document).ready(function(){

	// Grab elements for modal functionality
	var span = document.getElementsByClassName("close")[0];
	var modal = document.getElementById('myModal');

	// When a "Article Comments" button is clicked...
	$(document).on("click", ".view-comments", function(){

		// Grab data-id attr to know what article's comments to display
		var current_article_id = $(this).attr("data-id");

		// Add data-id attr to the add comment
		$(".add-comment").attr("data-id", current_article_id);

		// Grab article's comments
		$.ajax({
			method: "GET",
			url: "/comments/" + current_article_id
		})
		// When comments are returned, dynamically display comments to the modal
		.done(function(data){

			// Display modal...
			modal.style.display = "block";

			// If there no comments, display "None"
			if (data.comments.length === 0) {
				$("#comments").empty();
				$("#comments").append("<div class='well well-sm'>None</div>");
			}
			else {
				$("#comments").empty();

				(data.comments).forEach(function(item){
					$("#comments").append("<div class='well well-sm' id='comment-"+ item._id +"'>"+ item.body +
						"<button class='btn btn-danger btn-xs delete-comment' data-id="+ item._id +">" +
						"<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>" +
						"</button></div>");
				});
			}
		});
	});

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
    	modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}

	// When a "Delete From Saved" button is clicked
	$(document).on("click", ".delete-article", function(){

		// Grab data-id attr to know what article to remove
		var article_id = $(this).attr("data-id");
		
		// Use article_id to unsave the article
		$.ajax({
			method: "PUT",
			url: "/unsave/" + article_id
		}).done(function(){

			// When database is updated, dynamically remove the article
			$("#article-" + article_id).remove();
		});
	});

	// When an "Add Comment" button is clicked...
	$(document).on("click", ".add-comment", function(){

		// Grab user's input
		var new_comment = $("textarea").val().trim();

		// Grab article's id to determine what article it belongs to
		var article_id = $(this).attr("data-id");

		// Add comment to the database
		$.ajax({
			method: "POST",
			url: "/create-comment/" + article_id,
			data: {
				body: new_comment
			}
		}).done(function(data){

			// When the database is updated, dynamically add the comment to the modal window
			$("div .well").remove();
			$("textarea").val(""); 

			$("#comments").append("<div class='well well-sm' id='comment-"+ data._id +"'>"+ data.body +
				"<button class='btn btn-danger btn-xs delete-comment' data-id="+ data._id +">" +
				"<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>" +
				"</button></div>");
		});
		
	});

	// When a comment's X button is clicked...
	$(document).on("click", ".delete-comment", function(){

		// Grab data-id attr to know what comment to delete
		var comment_id = $(this).attr("data-id");
		
		// Delete comment from the database
		$.ajax({
			method: "DELETE",
			url: "/delete-comment/" + comment_id
		})
		.done(function(){

			// When the database is updated, dynamically remove comment
			$("#comment-" + comment_id).remove();
		});
	});


});