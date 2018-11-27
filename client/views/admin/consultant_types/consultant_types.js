var pageSession = new ReactiveDict();

Template.AdminConsultantTypes.rendered = function() {
	
};

Template.AdminConsultantTypes.events({
	
});

Template.AdminConsultantTypes.helpers({
	
});

var AdminConsultantTypesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminConsultantTypesViewSearchString");
	var sortBy = pageSession.get("AdminConsultantTypesViewSortBy");
	var sortAscending = pageSession.get("AdminConsultantTypesViewSortAscending");
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

var AdminConsultantTypesViewExport = function(cursor, fileType) {
	var data = AdminConsultantTypesViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminConsultantTypesView.rendered = function() {
	pageSession.set("AdminConsultantTypesViewStyle", "table");
	
};

Template.AdminConsultantTypesView.events({
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
				pageSession.set("AdminConsultantTypesViewSearchString", searchString);
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
					pageSession.set("AdminConsultantTypesViewSearchString", searchString);
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
					pageSession.set("AdminConsultantTypesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.consultant_types.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminConsultantTypesViewExport(this.admin_consultant_type, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminConsultantTypesViewExport(this.admin_consultant_type, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminConsultantTypesViewExport(this.admin_consultant_type, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminConsultantTypesViewExport(this.admin_consultant_type, "json");
	}

	
});

Template.AdminConsultantTypesView.helpers({

	"insertButtonClass": function() {
		return ConsultantType.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.admin_consultant_type || this.admin_consultant_type.count() == 0;
	},
	"isNotEmpty": function() {
		return this.admin_consultant_type && this.admin_consultant_type.count() > 0;
	},
	"isNotFound": function() {
		return this.admin_consultant_type && pageSession.get("AdminConsultantTypesViewSearchString") && AdminConsultantTypesViewItems(this.admin_consultant_type).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminConsultantTypesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminConsultantTypesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminConsultantTypesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminConsultantTypesViewStyle") == "gallery";
	}

	
});


Template.AdminConsultantTypesViewTable.rendered = function() {
	
};

Template.AdminConsultantTypesViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminConsultantTypesViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminConsultantTypesViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminConsultantTypesViewSortAscending") || false;
			pageSession.set("AdminConsultantTypesViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminConsultantTypesViewSortAscending", true);
		}
	}
});

Template.AdminConsultantTypesViewTable.helpers({
	"tableItems": function() {
		return AdminConsultantTypesViewItems(this.admin_consultant_type);
	}
});


Template.AdminConsultantTypesViewTableItems.rendered = function() {
	
};

Template.AdminConsultantTypesViewTableItems.events({
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

		ConsultantType.update({ _id: this._id }, { $set: values });

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
						ConsultantType.remove({ _id: me._id });
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
		Router.go("admin.consultant_types.edit", {ctId: this._id});
		return false;
	}
});

Template.AdminConsultantTypesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return ConsultantType.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return ConsultantType.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
