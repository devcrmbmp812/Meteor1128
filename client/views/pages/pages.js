Template.Pages.rendered = function () {
}

Template.Pages.helpers({
	getTitle: function(title) {
		document.title = 'PM Data - ' + title;
		return title;
	}
})
