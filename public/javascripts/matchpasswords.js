function matchPasswords() {
	var originalPassword = $("#pwd").val();
	var repeatedPassword = $("#pwd2").val();
	if(originalPassword !== repeatedPassword) {
		$("#rep-pass").html("Las contraseñas no coinciden")
	}
	else {
		$("#rep-pass").hide();
	}
}