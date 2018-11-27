var pageSession = new ReactiveDict();

Template.AdminIndustry.rendered = function() {
	
};

Template.AdminIndustry.events({
	
});

Template.AdminIndustry.helpers({
	
});

var AdminIndustryViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminIndustryViewSearchString");
	var sortBy = pageSession.get("AdminIndustryViewSortBy");
	var sortAscending = pageSession.get("AdminIndustryViewSortAscending");
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

var AdminIndustryViewExport = function(cursor, fileType) {
	var data = AdminIndustryViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminIndustryView.rendered = function() {
	pageSession.set("AdminIndustryViewStyle", "table");
	
};

Template.AdminIndustryView.events({
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
				pageSession.set("AdminIndustryViewSearchString", searchString);
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
					pageSession.set("AdminIndustryViewSearchString", searchString);
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
					pageSession.set("AdminIndustryViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.industry.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminIndustryViewExport(this.admin_industry, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminIndustryViewExport(this.admin_industry, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminIndustryViewExport(this.admin_industry, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminIndustryViewExport(this.admin_industry, "json");
	}

	
});

Template.AdminIndustryView.helpers({

	"insertButtonClass": function() {
		return Industry.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.admin_industry || this.admin_industry.count() == 0;
	},
	"isNotEmpty": function() {
		return this.admin_industry && this.admin_industry.count() > 0;
	},
	"isNotFound": function() {
		return this.admin_industry && pageSession.get("AdminIndustryViewSearchString") && AdminIndustryViewItems(this.admin_industry).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminIndustryViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminIndustryViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminIndustryViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminIndustryViewStyle") == "gallery";
	}

	
});


Template.AdminIndustryViewTable.rendered = function() {
	
};

Template.AdminIndustryViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminIndustryViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminIndustryViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminIndustryViewSortAscending") || false;
			pageSession.set("AdminIndustryViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminIndustryViewSortAscending", true);
		}
	}
});

Template.AdminIndustryViewTable.helpers({
	"tableItems": function() {
		return AdminIndustryViewItems(this.admin_industry);
	}
});


Template.AdminIndustryViewTableItems.rendered = function() {
	
};

Template.AdminIndustryViewTableItems.events({
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

		Industry.update({ _id: this._id }, { $set: values });

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
						Industry.remove({ _id: me._id });
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
		Router.go("admin.industry.edit", {id: this._id});
		return false;
	}
});

Template.AdminIndustryViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Industry.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Industry.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
