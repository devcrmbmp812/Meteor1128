var pageSession = new ReactiveDict();

Template.SearchBusinessListings.rendered = function() {

};

Template.SearchBusinessListings.events({

});

Template.SearchBusinessListings.helpers({

});

var SearchBusinessListingsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("SearchBusinessListingsViewSearchString");
	var sortBy = pageSession.get("SearchBusinessListingsViewSortBy");
	var sortAscending = pageSession.get("SearchBusinessListingsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["company_name"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};



Template.SearchBusinessListingsView.rendered = function() {
	pageSession.set("SearchBusinessListingsViewStyle", "table");

};

Template.SearchBusinessListingsView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("SearchBusinessListingsViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("SearchBusinessListingsViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("SearchBusinessListingsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	}
});

Template.SearchBusinessListingsView.helpers({

	"insertButtonClass": function() {
		return Listing.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.admin_listings || this.admin_listings.count() == 0;
	},
	"isNotEmpty": function() {
		return this.admin_listings && this.admin_listings.count() > 0;
	},
	"isNotFound": function() {
		return this.admin_listings && pageSession.get("SearchBusinessListingsViewSearchString") && SearchBusinessListingsViewItems(this.admin_listings).length == 0;
	},
	"searchString": function() {
		return pageSession.get("SearchBusinessListingsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("SearchBusinessListingsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("SearchBusinessListingsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("SearchBusinessListingsViewStyle") == "gallery";
	},
	"tableItems": function() {
		return SearchBusinessListingsViewItems(this.admin_listings);
	}


});

Template.SearchBusinessListingsViewItem.events({
	"click #more-button": function(e, t) {
		e.preventDefault();
		//Router.go("user.listing_detail", {listingId: this._id});
		Session.set("urlQuery", "");
		Router.go("home_public_listing_detail", {listingId: this._id});
		return false;
	},
});

Template.SearchBusinessListingsViewItem.helpers({
	logoImage: function (img) {
		return (!img || img.length == 0) ? '/images/logo-placeholder.png' : Meteor.settings.public.site_host + "/" + img[0].path;
	},

})
