var pageSession = new ReactiveDict();

Template.AdminListingsEdit.rendered = function() {
	Session.set("currentListing", Router.current().params.id);
};

Template.AdminListingsEdit.events({

});

Template.AdminListingsEdit.helpers({

});

// Template.AdminListingsEditForm.rendered = function() {
// 	// var edit_listing = Listing.findOne({_id:Session.get("currentListing")}, {});
// 	// var date = edit_listing.expirationDate;
// 	// var expDate = moment(date).format('DD/MM/YYYY');
// 	// console.log(expDate);
// 	// $("#expirationDate").val(expDate);
// 	$('.datepicker').datepicker({
// 	    format: 'mm/dd/yyyy',
// 	});
// };
Template.AdminListingsEditForm.onRendered(function() {
	//alert("hello");
    //this.$('.datetimepicker').datetimepicker();
});
Template.AdminListingsEditForm.events({
	"click #update_listing_status": function(e, t) {
		e.preventDefault();
		var status = $("#status option:selected").val();
		var expirationDate = moment($("#expirationDate").val()).format('DD/MM/YYYY');
		var values = {status: status, expirationDate: expirationDate};
		Listing.update({ _id: Session.get("currentListing") }, { $set: values }, {});
		bootbox.dialog({
			message: "Sucessfully updated status and expiration date.",
			title: "Listing Update",
			animate: false,
			buttons: {
				success: {
					label: "OK",
					className: "btn-success",
				}
			}
		});

	}
})
Template.AdminListingsEditEditForm.rendered = function() {


	pageSession.set("adminListingsEditEditFormInfoMessage", "");
	pageSession.set("adminListingsEditEditFormErrorMessage", "");

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
	//$("input[autofocus]").focus();
};

Template.AdminListingsEditEditForm.events({
	"submit #form-submit-button": function(e, t) {
		e.preventDefault();
		pageSession.set("adminListingsEditEditFormInfoMessage", "");
		pageSession.set("adminListingsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminListingsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(adminListingsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminListingsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.listings", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminListingsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {

				console.log(values);
				Listing.update({ _id: t.data.edit_listing._id }, { $set: values }, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();



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

Template.AdminListingsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminListingsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminListingsEditEditFormErrorMessage");
	},
	selected: function(key, value) {
	  return key == value ? true : false;
	},
	selectedMultiple: function (keyArray, value) {
		return _.contains(keyArray, value);
	},
	selectedMultipleEntry: function (keyArray, value) {
		return _.contains(keyArray, value) ? value + ' selected' : value;
	},
	myFormData: function() {
	    return { directoryName: 'images', prefix: this.params.id, _id: this.params.id }
	},
	myLogoData: function() {
	    return { directoryName: 'logo', prefix: this.params.id, _id: this.params.id }
	},
	filesToUpload: function() {
	    return Uploader.info.get();
	},

});

