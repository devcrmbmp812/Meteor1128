showModalMessageWithTitle = function (title, message) {
	bootbox.dialog({
	message: message,
	title: title,
	animate: false,
	buttons: {
		success: {
			label: "OK",
			className: "btn-success",
		}
	}
});
}