var pageSession = new ReactiveDict();

Template.AdminProjectTeamLocation.rendered = function() {
	
};

Template.AdminProjectTeamLocation.events({
	
});

Template.AdminProjectTeamLocation.helpers({
	
});

var AdminProjectTeamLocationViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminProjectTeamLocationViewSearchString");
	var sortBy = pageSession.get("AdminProjectTeamLocationViewSortBy");
	var sortAscending = pageSession.get("AdminProjectTeamLocationViewSortAscending");
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

var AdminProjectTeamLocationViewExport = function(cursor, fileType) {
	var data = AdminProjectTeamLocationViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminProjectTeamLocationView.rendered = function() {
	pageSession.set("AdminProjectTeamLocationViewStyle", "table");
	
};

Template.AdminProjectTeamLocationView.events({
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
				pageSession.set("AdminProjectTeamLocationViewSearchString", searchString);
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
					pageSession.set("AdminProjectTeamLocationViewSearchString", searchString);
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
					pageSession.set("AdminProjectTeamLocationViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.project_team_location.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminProjectTeamLocationViewExport(this.admin_project_team_location, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminProjectTeamLocationViewExport(this.admin_project_team_location, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminProjectTeamLocationViewExport(this.admin_project_team_location, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminProjectTeamLocationViewExport(this.admin_project_team_location, "json");
	}

	
});

Template.AdminProjectTeamLocationView.helpers({

	"insertButtonClass": function() {
		return ProjectTeamLocation.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.admin_project_team_location || this.admin_project_team_location.count() == 0;
	},
	"isNotEmpty": function() {
		return this.admin_project_team_location && this.admin_project_team_location.count() > 0;
	},
	"isNotFound": function() {
		return this.admin_project_team_location && pageSession.get("AdminProjectTeamLocationViewSearchString") && AdminProjectTeamLocationViewItems(this.admin_project_team_location).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminProjectTeamLocationViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminProjectTeamLocationViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminProjectTeamLocationViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminProjectTeamLocationViewStyle") == "gallery";
	}

	
});


Template.AdminProjectTeamLocationViewTable.rendered = function() {
	
};

Template.AdminProjectTeamLocationViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminProjectTeamLocationViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminProjectTeamLocationViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminProjectTeamLocationViewSortAscending") || false;
			pageSession.set("AdminProjectTeamLocationViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminProjectTeamLocationViewSortAscending", true);
		}
	}
});

Template.AdminProjectTeamLocationViewTable.helpers({
	"tableItems": function() {
		return AdminProjectTeamLocationViewItems(this.admin_project_team_location);
	}
});


Template.AdminProjectTeamLocationViewTableItems.rendered = function() {
	
};

Template.AdminProjectTeamLocationViewTableItems.events({
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

		ProjectTeamLocation.update({ _id: this._id }, { $set: values });

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
						ProjectTeamLocation.remove({ _id: me._id });
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
		Router.go("admin.project_team_location.edit", {id: this._id});
		return false;
	}
});

Template.AdminProjectTeamLocationViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return ProjectTeamLocation.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return ProjectTeamLocation.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
