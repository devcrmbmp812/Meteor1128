var pageSession = new ReactiveDict();

Template.AdminIndustrySubSector.rendered = function() {
	
};

Template.AdminIndustrySubSector.events({
	
});

Template.AdminIndustrySubSector.helpers({
	
});

var AdminIndustrySubSectorViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminIndustrySubSectorViewSearchString");
	var sortBy = pageSession.get("AdminIndustrySubSectorViewSortBy");
	var sortAscending = pageSession.get("AdminIndustrySubSectorViewSortAscending");
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

var AdminIndustrySubSectorViewExport = function(cursor, fileType) {
	var data = AdminIndustrySubSectorViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminIndustrySubSectorView.rendered = function() {
	pageSession.set("AdminIndustrySubSectorViewStyle", "table");
	
};

Template.AdminIndustrySubSectorView.events({
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
				pageSession.set("AdminIndustrySubSectorViewSearchString", searchString);
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
					pageSession.set("AdminIndustrySubSectorViewSearchString", searchString);
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
					pageSession.set("AdminIndustrySubSectorViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.industry_sub_sector.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminIndustrySubSectorViewExport(this.admin_industry_sub_sector, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminIndustrySubSectorViewExport(this.admin_industry_sub_sector, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminIndustrySubSectorViewExport(this.admin_industry_sub_sector, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminIndustrySubSectorViewExport(this.admin_industry_sub_sector, "json");
	}

	
});

Template.AdminIndustrySubSectorView.helpers({

	"insertButtonClass": function() {
		return IndustrySubSector.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.admin_industry_sub_sector || this.admin_industry_sub_sector.count() == 0;
	},
	"isNotEmpty": function() {
		return this.admin_industry_sub_sector && this.admin_industry_sub_sector.count() > 0;
	},
	"isNotFound": function() {
		return this.admin_industry_sub_sector && pageSession.get("AdminIndustrySubSectorViewSearchString") && AdminIndustrySubSectorViewItems(this.admin_industry_sub_sector).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminIndustrySubSectorViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminIndustrySubSectorViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminIndustrySubSectorViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminIndustrySubSectorViewStyle") == "gallery";
	}

	
});


Template.AdminIndustrySubSectorViewTable.rendered = function() {
	
};

Template.AdminIndustrySubSectorViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminIndustrySubSectorViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminIndustrySubSectorViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminIndustrySubSectorViewSortAscending") || false;
			pageSession.set("AdminIndustrySubSectorViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminIndustrySubSectorViewSortAscending", true);
		}
	}
});

Template.AdminIndustrySubSectorViewTable.helpers({
	"tableItems": function() {
		return AdminIndustrySubSectorViewItems(this.admin_industry_sub_sector);
	}
});


Template.AdminIndustrySubSectorViewTableItems.rendered = function() {
	
};

Template.AdminIndustrySubSectorViewTableItems.events({
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

		IndustrySubSector.update({ _id: this._id }, { $set: values });

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
						IndustrySubSector.remove({ _id: me._id });
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
		Router.go("admin.industry_sub_sector.edit", {id: this._id});
		return false;
	}
});

Template.AdminIndustrySubSectorViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return IndustrySubSector.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return IndustrySubSector.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
