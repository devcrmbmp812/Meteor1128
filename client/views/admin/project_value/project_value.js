var pageSession = new ReactiveDict();

Template.AdminProjectValue.rendered = function() {
	
};

Template.AdminProjectValue.events({
	
});

Template.AdminProjectValue.helpers({
	
});

var AdminProjectValueViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminProjectValueViewSearchString");
	var sortBy = pageSession.get("AdminProjectValueViewSortBy");
	var sortAscending = pageSession.get("AdminProjectValueViewSortAscending");
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

var AdminProjectValueViewExport = function(cursor, fileType) {
	var data = AdminProjectValueViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminProjectValueView.rendered = function() {
	pageSession.set("AdminProjectValueViewStyle", "table");
	
};

Template.AdminProjectValueView.events({
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
				pageSession.set("AdminProjectValueViewSearchString", searchString);
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
					pageSession.set("AdminProjectValueViewSearchString", searchString);
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
					pageSession.set("AdminProjectValueViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.project_value.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminProjectValueViewExport(this.admin_project_value, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminProjectValueViewExport(this.admin_project_value, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminProjectValueViewExport(this.admin_project_value, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminProjectValueViewExport(this.admin_project_value, "json");
	}

	
});

Template.AdminProjectValueView.helpers({

	"insertButtonClass": function() {
		return ProjectValue.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.admin_project_value || this.admin_project_value.count() == 0;
	},
	"isNotEmpty": function() {
		return this.admin_project_value && this.admin_project_value.count() > 0;
	},
	"isNotFound": function() {
		return this.admin_project_value && pageSession.get("AdminProjectValueViewSearchString") && AdminProjectValueViewItems(this.admin_project_value).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminProjectValueViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminProjectValueViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminProjectValueViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminProjectValueViewStyle") == "gallery";
	}

	
});


Template.AdminProjectValueViewTable.rendered = function() {
	
};

Template.AdminProjectValueViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminProjectValueViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminProjectValueViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminProjectValueViewSortAscending") || false;
			pageSession.set("AdminProjectValueViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminProjectValueViewSortAscending", true);
		}
	}
});

Template.AdminProjectValueViewTable.helpers({
	"tableItems": function() {
		return AdminProjectValueViewItems(this.admin_project_value);
	}
});


Template.AdminProjectValueViewTableItems.rendered = function() {
	
};

Template.AdminProjectValueViewTableItems.events({
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

		ProjectValue.update({ _id: this._id }, { $set: values });

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
						ProjectValue.remove({ _id: me._id });
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
		Router.go("admin.project_value.edit", {projectId: this._id});
		return false;
	}
});

Template.AdminProjectValueViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return ProjectValue.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return ProjectValue.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
