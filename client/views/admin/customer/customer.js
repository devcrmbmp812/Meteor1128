var pageSession = new ReactiveDict();

var CustomerListingsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminListingsViewSearchString");
	var sortBy = pageSession.get("AdminListingsViewSortBy");
	var sortAscending = pageSession.get("AdminListingsViewSortAscending");
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


Template.CustomerListings.rendered = function() {
	pageSession.set("AdminListingsViewStyle", "table");

};

Template.CustomerListings.events({

});

Template.CustomerListings.helpers({

});

Template.CustomerListings.helpers({

	"insertButtonClass": function() {
		return Listing.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.user_listings || this.user_listings.count() == 0;
	},
	"isNotEmpty": function() {
		return this.user_listings && this.user_listings.count() > 0;
	},
	"isNotFound": function() {
		return this.user_listings && pageSession.get("AdminListingsViewSearchString") && CustomerListingsViewItems(this.user_listings).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminListingsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminListingsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminListingsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminListingsViewStyle") == "gallery";
	}


});


Template.CustomerListingsViewTable.rendered = function() {

};

Template.CustomerListingsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminListingsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminListingsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminListingsViewSortAscending") || false;
			pageSession.set("AdminListingsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminListingsViewSortAscending", true);
		}
	}
});

Template.CustomerListingsViewTable.helpers({
	"tableItems": function() {
		return CustomerListingsItems(this.user_listings);
	}
});


Template.CustomerListingsViewTableItems.rendered = function() {

};

Template.CustomerListingsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		Router.go("admin.listings.edit", {id: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Listing.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Listing.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.listings.edit", {id: this._id, userId: this.createdBy});
		return false;
	}
});

Template.CustomerListingsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" },
	"editButtonClass": function() {
		return Listing.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Listing.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
