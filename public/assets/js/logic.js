$(document).ready(function(){
	var span = document.getElementsByClassName("close")[0];
	var modal = document.getElementById('myModal');

	$("#scrape-btn").on("click", function(){

		$.ajax({
			method: "POST",
			url: "/scrape"
		})
		.done(function(data){
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

	$(document).on("click", ".save-article", function(){
		var article_id = $(this).attr("data-id");
		
		$.ajax({
			method: "PUT",
			url: "/save/" + article_id
		}).done(function(){
			$("#article-" + article_id).remove();
		});
	});


});