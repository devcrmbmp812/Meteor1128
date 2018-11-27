var pageSession = new ReactiveDict();

Template.AdminProjectValueEdit.rendered = function() {
	console.log('this', this.edit_project_value);
};

Template.AdminProjectValueEdit.events({

});

Template.AdminProjectValueEdit.helpers({

});

Template.AdminProjectValueEditEditForm.rendered = function() {


	pageSession.set("adminProjectValueEditEditFormInfoMessage", "");
	pageSession.set("adminProjectValueEditEditFormErrorMessage", "");

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

Template.AdminProjectValueEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminProjectValueEditEditFormInfoMessage", "");
		pageSession.set("adminProjectValueEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminProjectValueEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(adminProjectValueEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminProjectValueEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.project_value", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminProjectValueEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {


				ProjectValue.update({ _id: t.data.edit_project_value._id }, { $set: values }, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();



		Router.go("admin.project_value", {});
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

Template.AdminProjectValueEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminProjectValueEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminProjectValueEditEditFormErrorMessage");
	}

});
