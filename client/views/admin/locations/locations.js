var pageSession = new ReactiveDict();

Template.AdminLocations.rendered = function() {
};

Template.AdminLocations.events({

});

Template.AdminLocations.helpers({

});

var AdminLocationsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminLocationsViewSearchString");
	var sortBy = pageSession.get("AdminLocationsViewSortBy");
	var sortAscending = pageSession.get("AdminLocationsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name"];
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

var AdminLocationsViewExport = function(cursor, fileType) {
	var data = AdminLocationsViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminLocationsView.rendered = function() {
	pageSession.set("AdminLocationsViewStyle", "table");

};

Template.AdminLocationsView.events({
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
				pageSession.set("AdminLocationsViewSearchString", searchString);
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
					pageSession.set("AdminLocationsViewSearchString", searchString);
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
					pageSession.set("AdminLocationsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.locations.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminLocationsViewExport(this.admin_locations, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminLocationsViewExport(this.admin_locations, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminLocationsViewExport(this.admin_locations, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminLocationsViewExport(this.admin_locations, "json");
	}


});

Template.AdminLocationsView.helpers({

	"insertButtonClass": function() {
		return Locations.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.admin_locations || this.admin_locations.count() == 0;
	},
	"isNotEmpty": function() {
		console.log(this.admin_locations);
		return this.admin_locations && this.admin_locations.count() > 0;
	},
	"isNotFound": function() {
		return this.admin_locations && pageSession.get("AdminLocationsViewSearchString") && AdminLocationsViewItems(this.admin_industry).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminLocationsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminLocationsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminIndustryViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminIndustryViewStyle") == "gallery";
	}


});


Template.AdminLocationsViewTable.rendered = function() {

};

Template.AdminLocationsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminLocationsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminIndustryViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminLocationsViewSortAscending") || false;
			pageSession.set("AdminLocationsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminLocationsViewSortAscending", true);
		}
	}
});

Template.AdminLocationsViewTable.helpers({
	"tableItems": function() {
		console.log(AdminLocationsViewItems(this.admin_locations));
		return AdminLocationsViewItems(this.admin_locations);
	}
});


Template.AdminLocationsViewTableItems.rendered = function() {

};

Template.AdminLocationsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Locations.update({ _id: this._id }, { $set: values });

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
						Locations.remove({ _id: me._id });
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
		Router.go("admin.locations.edit", {id: this._id});
		return false;
	}
});

Template.AdminLocationsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" },
	"editButtonClass": function() {
		return Locations.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Locations.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
