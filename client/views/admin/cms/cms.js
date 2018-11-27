var pageSession = new ReactiveDict();

Template.AdminCms.rendered = function() {

};

Template.AdminCms.events({

});

Template.AdminCms.helpers({

});

var AdminCmsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminCmsViewSearchString");
	var sortBy = pageSession.get("AdminCmsViewSortBy");
	var sortAscending = pageSession.get("AdminCmsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["title"];
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

var AdminCmsViewExport = function(cursor, fileType) {
	var data = AdminCmsViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminCmsView.rendered = function() {
	pageSession.set("AdminCmsViewStyle", "table");

};

Template.AdminCmsView.events({
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
				pageSession.set("AdminCmsViewSearchString", searchString);
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
					pageSession.set("AdminCmsViewSearchString", searchString);
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
					pageSession.set("AdminCmsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.cms.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminCmsViewExport(this.cms, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminCmsViewExport(this.cms, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminCmsViewExport(this.cms, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminCmsViewExport(this.cms, "json");
	}


});

Template.AdminCmsView.helpers({

	"insertButtonClass": function() {
		return Cms.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.cms || this.cms.count() == 0;
	},
	"isNotEmpty": function() {
		return this.cms && this.cms.count() > 0;
	},
	"isNotFound": function() {
		return this.cms && pageSession.get("AdminCmsViewSearchString") && AdminCmsViewItems(this.cms).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminCmsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminCmsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminCmsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminCmsViewStyle") == "gallery";
	}


});


Template.AdminCmsViewTable.rendered = function() {

};

Template.AdminCmsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminCmsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminCmsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminCmsViewSortAscending") || false;
			pageSession.set("AdminCmsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminCmsViewSortAscending", true);
		}
	}
});

Template.AdminCmsViewTable.helpers({
	"tableItems": function() {
		return AdminCmsViewItems(this.cms);
	}
});


Template.AdminCmsViewTableItems.rendered = function() {

};

Template.AdminCmsViewTableItems.events({


	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Cms.update({ _id: this._id }, { $set: values });

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
						Cms.remove({ _id: me._id });
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
		Router.go("admin.cms.edit", {id: this._id});
		return false;
	}
});

Template.AdminCmsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" },
	"editButtonClass": function() {
		return Cms.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Cms.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"getCmsLandingPage": function (name) {
        var url = Meteor.settings.public.site_cms_host + ((name == "about_us" || name == "contact_us") ? "/" : "/pages/") + name;
		return url;
	}
});
