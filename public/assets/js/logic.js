/* MongoDB - Moongoose Web Scraper
Functionality for main page */

$(document).ready(function(){

	// Grab elements for modal functionality
	var span = document.getElementsByClassName("close")[0];
	var modal = document.getElementById('myModal');

	// When "New Articles!" button is clicked...
	$("#scrape-btn").on("click", function(){

		// Scrape new articles and save them to the database
		$.ajax({
			method: "POST",
			url: "/scrape"
		})
		// when scraping is complete...
		.done(function(data){

			// Display modal window with message
			$("#new-articles-number").html("SCRAPE COMPLETE!");
			modal.style.display = "block";
		});
	});

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
    	modal.style.display = "none";
    	window.location.href = "/";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	        window.location.href = "/";
	    }
	}

	// When a "Save Article" button is clicked...
	$(document).on("click", ".save-article", function(){

		// Grab data-id attr to know what article to save
		var article_id = $(this).attr("data-id");
		
		// Use article_id to save the article
		$.ajax({
			method: "PUT",
			url: "/save/" + article_id
		}).done(function(){

			// When database is updated, dynamically remove article well
			$("#article-" + article_id).remove();
		});
	});
});

