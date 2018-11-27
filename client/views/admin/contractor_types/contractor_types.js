var pageSession = new ReactiveDict();

Template.AdminContractorTypes.rendered = function() {

};

Template.AdminContractorTypes.events({

});

Template.AdminContractorTypes.helpers({

});

var AdminContractorTypesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminContractorTypesViewSearchString");
	var sortBy = pageSession.get("AdminContractorTypesViewSortBy");
	var sortAscending = pageSession.get("AdminContractorTypesViewSortAscending");
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

var AdminContractorTypesViewExport = function(cursor, fileType) {
	var data = AdminContractorTypesViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminContractorTypesView.rendered = function() {
	pageSession.set("AdminContractorTypesViewStyle", "table");

};

Template.AdminContractorTypesView.events({
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
				pageSession.set("AdminContractorTypesViewSearchString", searchString);
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
					pageSession.set("AdminContractorTypesViewSearchString", searchString);
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
					pageSession.set("AdminContractorTypesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.contractor_types.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminContractorTypesViewExport(this.admin_contractor_type, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminContractorTypesViewExport(this.admin_contractor_type, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminContractorTypesViewExport(this.admin_contractor_type, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminContractorTypesViewExport(this.admin_contractor_type, "json");
	}


});

Template.AdminContractorTypesView.helpers({

	"insertButtonClass": function() {
		return ContractorType.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.admin_contractor_type || this.admin_contractor_type.count() == 0;
	},
	"isNotEmpty": function() {
		return this.admin_contractor_type && this.admin_contractor_type.count() > 0;
	},
	"isNotFound": function() {
		return this.admin_contractor_type && pageSession.get("AdminContractorTypesViewSearchString") && AdminContractorTypesViewItems(this.admin_contractor_type).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminContractorTypesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminContractorTypesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminContractorTypesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminContractorTypesViewStyle") == "gallery";
	}


});


Template.AdminContractorTypesViewTable.rendered = function() {

};

Template.AdminContractorTypesViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminContractorTypesViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminContractorTypesViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminContractorTypesViewSortAscending") || false;
			pageSession.set("AdminContractorTypesViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminContractorTypesViewSortAscending", true);
		}
	}
});

Template.AdminContractorTypesViewTable.helpers({
	"tableItems": function() {
		return AdminContractorTypesViewItems(this.admin_contractor_type);
	}
});


Template.AdminContractorTypesViewTableItems.rendered = function() {

};

Template.AdminContractorTypesViewTableItems.events({
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

		ContractorType.update({ _id: this._id }, { $set: values });

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
						ContractorType.remove({ _id: me._id });
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
		Router.go("admin.contractor_types.edit", {ctId: this._id});
		return false;
	}
});

Template.AdminContractorTypesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" },
	"editButtonClass": function() {
		return ContractorType.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return ContractorType.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
