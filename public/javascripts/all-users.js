$(document).ready(function(){

	var alertSuccess = '<div class="alert alert-dismissible alert-success"><button type="button" class="close" data-dismiss="alert">×</button><strong><p>Done...!</p></strong> <p>User Deleted</p></div>';
	var alertWrong = '<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">×</button><strong><p>Oops..!</p></strong> <p>Something went wrong...</p></div>';
	$.ajax({
		url: "http://localhost:3000/users",
		dataType: "json",
		crossDomain: true,

	})
	.done(function (data) {
		$("#users").DataTable( {
			paging: false,
			data: data,
			columns: [
				{ data: '_id' },
				{ data: 'username' },
				{ data: 'name' },
				{ data: 'lastname' }
			]
		});
		$("tbody > tr").append('<i class="material-icons delete">delete</i>');
		$(".material-icons.delete").on('click', function(){
			var user = $(this).parent()[0];
			var id = $(user)[0]["firstChild"]["innerHTML"];
			
			$.ajax({
				url: 'delete-user',
				type: 'POST',
				data: {'id':id},
			})
			.done(function (data) {
				if (data == "OK") {
					$(".container").prepend(alertSuccess);
					$(user).remove();

				}
				else
				{
					$(".container").prepend(alertWrong);
				}
				$("button.close").on('click', function (err,data) {
					$(this).parent().remove();
				})
			});
		});
	});


});