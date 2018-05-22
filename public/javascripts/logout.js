$(document).ready(function() {
	$("span#logout").click(function (err,data) {
		$.ajax({
			url: "http://localhost:3000/logout",
			type: "POST",
		})
	})
});