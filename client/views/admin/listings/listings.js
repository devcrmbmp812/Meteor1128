var pageSession = new ReactiveDict();

Template.AdminListings.rendered = function() {

};

Template.AdminListings.events({

});

Template.AdminListings.helpers({

});

var AdminListingsViewItems = function(cursor) {
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

var AdminListingsViewExport = function(cursor, fileType) {
	var data = AdminListingsViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminListingsView.rendered = function() {
	pageSession.set("AdminListingsViewStyle", "table");

};

Template.AdminListingsView.events({
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
				pageSession.set("AdminListingsViewSearchString", searchString);
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
					pageSession.set("AdminListingsViewSearchString", searchString);
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
					pageSession.set("AdminListingsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		var id = strId(newObjId ());
		Listing.insert({_id: id});
		Router.go("admin.listings.insert", {id: id});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminListingsViewExport(this.admin_listings, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminListingsViewExport(this.admin_listings, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminListingsViewExport(this.admin_listings, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminListingsViewExport(this.admin_listings, "json");
	}


});

Template.AdminListingsView.helpers({

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
		return this.admin_listings && pageSession.get("AdminListingsViewSearchString") && AdminListingsViewItems(this.admin_listings).length == 0;
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


Template.AdminListingsViewTable.rendered = function() {

};

Template.AdminListingsViewTable.events({
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

Template.AdminListingsViewTable.helpers({
	"tableItems": function() {
		return AdminListingsViewItems(this.admin_listings);
	}
});


Template.AdminListingsViewTableItems.rendered = function() {

};

Template.AdminListingsViewTableItems.events({
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

Template.AdminListingsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" },
	"editButtonClass": function() {
		return Listing.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Listing.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
