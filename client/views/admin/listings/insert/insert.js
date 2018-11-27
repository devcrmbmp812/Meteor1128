var pageSession = new ReactiveDict();

Template.AdminListingsInsert.rendered = function() {

};

Template.AdminListingsInsertInsertForm.onDestroyed(function () {
  // deregister from some central store
  if (!pageSession.get("updateListing")) {
    var data = Template.currentData();
    console.log('onDestroy', Template.currentData());
    Listing.remove({_id: data.params.id}, {company_name: {$exists: false}});
  }
});

Template.AdminListingsInsert.events({

});

Template.AdminListingsInsert.helpers({

});

Template.AdminListingsInsertInsertForm.rendered = function() {


	pageSession.set("adminListingsInsertInsertFormInfoMessage", "");
	pageSession.set("adminListingsInsertInsertFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	//$("input[type='file']").fileinput();
	$("input[autofocus]").focus();
};

Template.AdminListingsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminListingsInsertInsertFormInfoMessage", "");
		pageSession.set("adminListingsInsertInsertFormErrorMessage", "");

		var self = this;
		var _id = this.params.id;
		function submitAction(msg) {
			var adminListingsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminListingsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
   				        pageSession.set("updateListing", true);
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminListingsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.listings", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminListingsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {


				newId = Listing.update({_id: _id} , { $set: values }, function(e) { if(e) errorAction(e.message); else submitAction(); });
      			//Meteor.call('listingUpsert', Router.current().params.id, values);
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();
		if (this.edit_listing && this.edit_listing.images) {
			_.forEach(this.edit_listing.images, function (obj) {
				Meteor.call('deleteFile', Router.current().params.id, obj.name);
			});
		}
		if (this.edit_listing && this.edit_listing.logo) {
			_.forEach(this.edit_listing.logo, function (obj) {
				Meteor.call('deleteLogo', Router.current().params.id, obj.name);
			});
		}
		Listing.remove({_id: this.params.id});


		Router.go("admin.listings", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	},

	"change #field-images": function(e, t) {
	e.preventDefault();
	var fileInput = $(e.currentTarget);
	var dataField = fileInput.attr("data-field");
	var hiddenInput = fileInput.closest("form").find("input[name='" + dataField + "']");

	FS.Utility.eachFile(event, function(file) {
		Files.insert(file, function (err, fileObj) {
			if(err) {
				console.log(err);
			} else {
				hiddenInput.val(fileObj._id);
			}
		});
	});
	},
	"click #form-add-address-button": function (e) {
		e.preventDefault();
		Modal.show('addNewAddress');
	}
});

Template.AdminListingsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminListingsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminListingsInsertInsertFormErrorMessage");
	},
	myFormData: function() {
	    return { directoryName: 'images', prefix: this.params.id, _id: this.params.id }
	},
	myLogoData: function() {
	    return { directoryName: 'logo', prefix: this.params.id, _id: this.params.id }
	},
	filesToUpload: function() {
	    return Uploader.info.get();
	}
});

