$(document).ready(function(){
	var span = document.getElementsByClassName("close")[0];
	var modal = document.getElementById('myModal');

	$(document).on("click", ".view-comments", function(){
		modal.style.display = "block";
		var current_article_id = $(this).attr("data-id");
		$(".add-comment").attr("data-id", current_article_id);
		$.ajax({
			method: "GET",
			url: "/comments/" + current_article_id
		})
		.done(function(data){
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

	$(document).on("click", ".delete-article", function(){
		var article_id = $(this).attr("data-id");
		console.log(article_id);
		$.ajax({
			method: "PUT",
			url: "/unsave/" + article_id
		}).done(function(){
			$("#article-" + article_id).remove();
		});
	});

	$(document).on("click", ".add-comment", function(){
		var new_comment = $("textarea").val().trim();
		var article_id = $(this).attr("data-id");
		console.log(article_id);

		$.ajax({
			method: "POST",
			url: "/create-comment/" + article_id,
			data: {
				body: new_comment
			}
		}).done(function(data){
			// console.log(data);
			$("textarea").val("");

			$("#comments").append("<div class='well well-sm' id='comment-"+ data._id +"'>"+ data.body +
				"<button class='btn btn-danger btn-xs delete-comment' data-id="+ data._id +">" +
				"<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>" +
				"</button></div>");
		});
		
	});

	$(document).on("click", ".delete-comment", function(){
		var comment_id = $(this).attr("data-id");
		
		$.ajax({
			method: "DELETE",
			url: "/delete-comment/" + comment_id
		})
		.done(function(){
			$("#comment-" + comment_id).remove();
		});
	});


});