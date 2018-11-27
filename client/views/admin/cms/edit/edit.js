var pageSession = new ReactiveDict();

Template.AdminCmsEdit.rendered = function() {

};

Template.AdminCmsEdit.events({

});

Template.AdminCmsEdit.helpers({

});

Template.AdminCmsEditEditForm.rendered = function() {

	$('.summernote').summernote();
	//$('.summernote').html($('#summernote').code($('#textarea#content').text()));
	pageSession.set("adminCmsEditEditFormInfoMessage", "");
	pageSession.set("adminCmsEditEditFormErrorMessage", "");

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

	$("input[type='file']").fileinput();
	$("input[autofocus]").focus();
};

Template.AdminCmsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminCmsEditEditFormInfoMessage", "");
		pageSession.set("adminCmsEditEditFormErrorMessage", "");
		var sHTML = $('.summernote').code();
		$("textarea#content").html(sHTML);
		console.log(sHTML);
		var self = this;

		function submitAction(msg) {
			var adminCmsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(adminCmsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminCmsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.cms", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminCmsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {


				Cms.update({ _id: t.data.edit_cms._id }, { $set: values }, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();



		Router.go("admin.cms", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}


});

Template.AdminCmsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminCmsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminCmsEditEditFormErrorMessage");
	}

});
