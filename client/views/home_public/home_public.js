var pageSession = new ReactiveDict();

Template.HomePublic.rendered = function() {
};

Template.HomePublic.events({

});

Template.HomePublic.helpers({

});

Template.HomePublicHomeJumbotron.rendered = function() {

};

Template.HomePublicHomeJumbotron.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("", {});
	}

});

Template.HomePublicHomeJumbotron.helpers({

});

Template.HomePublicHomeSearch.rendered = function() {
		//this.$("#locations").select2({placeholder: "Project Location", allowClear: true});
}

Template.HomePublicHomeSearch.helpers({
	sortedRegions: function () {

		var sortedList = LocationsList(this.locations);
		console.log(sortedList);
		return sortedList;
	}
});

Template.HomePublicHomeSearch.events({
		'click .home-btn': function(e) {
			e.preventDefault();
			console.log(e.currentTarget);
			$(".home-btn").removeClass('active');
			$(e.currentTarget).addClass('active');
		},
		'click .consultant-btn': function (e) {
			e.preventDefault();
			pageSession.set("type", "consultant");
			Router.go("home_public_search", {type: "consultant"});
		},
		'click .contractor-btn': function (e) {
			e.preventDefault();
			pageSession.set("type", "contractor");
			Router.go("home_public_search", {type: "contractor"});
		},
		'click .supplier-btn': function (e) {
			e.preventDefault();
			pageSession.set("type", "supplier");
			Router.go("home_public_search", {type: "supplier"});
		},
		"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var searchInput = $("select#type option:selected");//locations
		Session.set("location", searchInput.val());
		if(searchInput) { //&& pageSession.get("type") != undefined
			searchInput.focus();
			var searchString = searchInput.val();
			console.log(searchString);
			Router.go("home_public_search", {type: searchString});
		} else {
			showModalMessageWithTitle("", "Please select a type.")
		}
		return false;
	},
});