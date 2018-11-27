var pageSession = new ReactiveDict();

Template.AdminSupplierTypes.rendered = function() {

};

Template.AdminSupplierTypes.events({

});

Template.AdminSupplierTypes.helpers({

});

var AdminSupplierTypesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminSupplierTypesViewSearchString");
	var sortBy = pageSession.get("AdminSupplierTypesViewSortBy");
	var sortAscending = pageSession.get("AdminSupplierTypesViewSortAscending");
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

var AdminSupplierTypesViewExport = function(cursor, fileType) {
	var data = AdminSupplierTypesViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminSupplierTypesView.rendered = function() {
	pageSession.set("AdminSupplierTypesViewStyle", "table");

};

Template.AdminSupplierTypesView.events({
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
				pageSession.set("AdminSupplierTypesViewSearchString", searchString);
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
					pageSession.set("AdminSupplierTypesViewSearchString", searchString);
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
					pageSession.set("AdminSupplierTypesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.supplier_types.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminSupplierTypesViewExport(this.admin_supplier_type, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminSupplierTypesViewExport(this.admin_supplier_type, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminSupplierTypesViewExport(this.admin_supplier_type, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminSupplierTypesViewExport(this.admin_supplier_type, "json");
	}


});

Template.AdminSupplierTypesView.helpers({

	"insertButtonClass": function() {
		return SupplierType.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.admin_supplier_type || this.admin_supplier_type.count() == 0;
	},
	"isNotEmpty": function() {
		return this.admin_supplier_type && this.admin_supplier_type.count() > 0;
	},
	"isNotFound": function() {
		return this.admin_supplier_type && pageSession.get("AdminSupplierTypesViewSearchString") && AdminSupplierTypesViewItems(this.admin_supplier_type).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminSupplierTypesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminSupplierTypesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminSupplierTypesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminSupplierTypesViewStyle") == "gallery";
	}


});


Template.AdminSupplierTypesViewTable.rendered = function() {

};

Template.AdminSupplierTypesViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminSupplierTypesViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminSupplierTypesViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminSupplierTypesViewSortAscending") || false;
			pageSession.set("AdminSupplierTypesViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminSupplierTypesViewSortAscending", true);
		}
	}
});

Template.AdminSupplierTypesViewTable.helpers({
	"tableItems": function() {
		return AdminSupplierTypesViewItems(this.admin_supplier_type);
	}
});


Template.AdminSupplierTypesViewTableItems.rendered = function() {

};

Template.AdminSupplierTypesViewTableItems.events({
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

		SupplierType.update({ _id: this._id }, { $set: values });

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
						SupplierType.remove({ _id: me._id });
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
		Router.go("admin.supplier_types.edit", {ctId: this._id});
		return false;
	}
});

Template.AdminSupplierTypesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" },
	"editButtonClass": function() {
		return SupplierType.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return SupplierType.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
