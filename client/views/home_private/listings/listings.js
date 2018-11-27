var pageSession = new ReactiveDict();
Template.UserListings.rendered = function () {
    console.log(Meteor.userId());
    //console.log(UserListingsViewItems(Listing.find({customer: Meteor.userId()}, {}) ));
};
Template.UserListings.events({});
Template.UserListings.helpers({});
var UserListingsViewItems = function (cursor) {
        console.log('cursor', cursor);
        if (!cursor) {
            return [];
        }
        var searchString = pageSession.get("UserListingsViewSearchString");
        var sortBy = pageSession.get("UserListingsViewSortBy");
        var sortAscending = pageSession.get("UserListingsViewSortAscending");
        if (typeof (sortAscending) === "undefined") sortAscending = true;
        var raw = cursor.fetch();
        console.log(raw);
        // filter
        var filtered = [];
        if (!searchString || searchString === "") {
            filtered = raw;
        } else {
            searchString = searchString.replace(".", "\\.");
            var regEx = new RegExp(searchString, "i");
            var searchFields = ["company_name"];
            filtered = _.filter(raw, function (item) {
                var match = false;
                _.each(searchFields, function (field) {
                    var value = (getPropertyValue(field, item) || "") + "";
                    match = match || (value && value.match(regEx));
                    if (match) {
                        return false;
                    }
                })
                return match;
            });
        }
        // sort
        if (sortBy) {
            filtered = _.sortBy(filtered, sortBy);
            // descending?
            if (!sortAscending) {
                filtered = filtered.reverse();
            }
        }
        return filtered;
    };
var UserListingsViewExport = function (cursor, fileType) {
        var data = AdminListingsViewItems(cursor);
        var exportFields = [];
        var str = convertArrayOfObjects(data, exportFields, fileType);
        var filename = "export." + fileType;
        downloadLocalResource(str, filename, "application/octet-stream");
    }
Template.UserListingsView.rendered = function () {
    pageSession.set("UserListingsViewStyle", "table");
};
Template.UserListingsView.events({
    "submit #dataview-controls": function (e, t) {
        return false;
    },
    "click #dataview-search-button": function (e, t) {
        e.preventDefault();
        var form = $(e.currentTarget).parent();
        if (form) {
            var searchInput = form.find("#dataview-search-input");
            if (searchInput) {
                searchInput.focus();
                var searchString = searchInput.val();
                pageSession.set("UserListingsViewSearchString", searchString);
            }
        }
        return false;
    },
    "keydown #dataview-search-input": function (e, t) {
        var form = $(e.currentTarget).parent();
        var searchInput = form.find("#dataview-search-input");
        if (e.which === 13) {
            e.preventDefault();
            if (form) {
                if (searchInput) {
                    var searchString = searchInput.val();
                    pageSession.set("UserListingsViewSearchString", searchString);
                }
            }
            return false;
        }
        if (e.which === 27) {
            e.preventDefault();
            if (form) {
                if (searchInput) {
                    searchInput.val("");
                    pageSession.set("UserListingsViewSearchString", "");
                }
            }
            return false;
        }
        return true;
    },
    "click #dataview-insert-button": function (e, t) {
        e.preventDefault();
        var id = strId(newObjId());
        Listing.insert({
            _id: id
        });
        Router.go("user.listings.insert", {
            id: id
        });
    },
    "click #dataview-export-default": function (e, t) {
        e.preventDefault();
        UserListingsViewExport(this.user_listings, "csv");
    },
    "click #dataview-export-csv": function (e, t) {
        e.preventDefault();
        UserListingsViewExport(this.user_listings, "csv");
    },
    "click #dataview-export-tsv": function (e, t) {
        e.preventDefault();
        UserListingsViewExport(this.user_listings, "tsv");
    },
    "click #dataview-export-json": function (e, t) {
        e.preventDefault();
        UserListingsViewExport(this.user_listings, "json");
    }
});
Template.UserListingsView.helpers({
    "insertButtonClass": function () {
        return Listing.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
    },
    "isEmpty": function () {
        return !this.user_listings || this.user_listings.count() === 0;
    },
    "isNotEmpty": function () {
        return this.user_listings && this.user_listings.count() > 0;
    },
    "isNotFound": function () {
        return this.user_listings && pageSession.get("UserListingsViewSearchString") && UserListingsViewItems(this.user_listings).length === 0;
    },
    "searchString": function () {
        return pageSession.get("UserListingsViewSearchString");
    },
    "viewAsTable": function () {
        return pageSession.get("UserListingsViewStyle") === "table";
    },
    "viewAsList": function () {
        return pageSession.get("UserListingsViewStyle") === "list";
    },
    "viewAsGallery": function () {
        return pageSession.get("UserListingsViewStyle") === "gallery";
    }
});
Template.UserListingsViewTable.rendered = function () {};
Template.UserListingsViewTable.events({
    "click .th-sortable": function (e, t) {
        e.preventDefault();
        var oldSortBy = pageSession.get("UserListingsViewSortBy");
        var newSortBy = $(e.target).attr("data-sort");
        pageSession.set("UserListingsViewSortBy", newSortBy);
        if (oldSortBy === newSortBy) {
            var sortAscending = pageSession.get("UserListingsViewSortAscending") || false;
            pageSession.set("UserListingsViewSortAscending", !sortAscending);
        } else {
            pageSession.set("UserListingsViewSortAscending", true);
        }
    }
});
Template.UserListingsViewTable.helpers({
    "tableItems": function () {
        return UserListingsViewItems(this.user_listings);
    }
});
Template.UserListingsViewTableItems.rendered = function () {};
Template.UserListingsViewTableItems.events({
    "click td": function (e, t) {
        e.preventDefault();
        Router.go("user.listings.edit", {
            id: this._id
        });
        return false;
    },
    "click .inline-checkbox": function (e, t) {
        e.preventDefault();
        if (!this || !this._id) return false;
        var fieldName = $(e.currentTarget).attr("data-field");
        if (!fieldName) return false;
        var values = {};
        values[fieldName] = !this[fieldName];
        Listing.update({
            _id: this._id
        }, {
            $set: values
        });
        return false;
    },
    "click #delete-button": function (e, t) {
        e.preventDefault();
        var me = this;
        bootbox.dialog({
            message: "Are you sure you want to delete this listing?",
            title: "Delete",
            animate: false,
            buttons: {
                success: {
                    label: "Yes",
                    className: "btn-success",
                    callback: function () {
                        Listing.remove({
                            _id: me._id
                        });
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
    "click #edit-button": function (e, t) {
        e.preventDefault();
        Router.go("user.listings.edit", {
            id: this._id
        });
        return false;
    },
    "click #clone-button": function (e, t) {
        e.preventDefault();
        //Router.go("user.listings.edit", {id: this._id});
        var company = this;
        bootbox.prompt({
            title: "What is name of this business?",
            value: this.company_name,
            callback: function (result) {
                if (result === null) {
                    //Example.show("Prompt dismissed");
                } else {
                    bootbox.confirm({
                        message: 'To create your new listing you must agree to PmData\'s <a href="/pages/terms_of_use" target="_blank">Terms & Conditions</a> and <a href="/pages/privacy_policy" target="_blank">Privacy Policy</a>',
                        callback: function (r) {
                            if (!!r) {
                              company.company_name = result;
                              delete company._id;
                              Listing.insert(company);
                            }
                        }
                    })
                }
            }
        });
        return false;
    }
});
Template.UserListingsViewTableItems.helpers({
    "checked": function (value) {
        return value ? "checked" : ""
    },
    "editButtonClass": function () {
        return Listing.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
    },
    "deleteButtonClass": function () {
        return Listing.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
    }
});