var pageSession = new ReactiveDict();

Template.AdminConsultantTypesEdit.rendered = function() {
	
};

Template.AdminConsultantTypesEdit.events({
	
});

Template.AdminConsultantTypesEdit.helpers({
	
});

Template.AdminConsultantTypesEditEditForm.rendered = function() {
	

	pageSession.set("adminConsultantTypesEditEditFormInfoMessage", "");
	pageSession.set("adminConsultantTypesEditEditFormErrorMessage", "");

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

Template.AdminConsultantTypesEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminConsultantTypesEditEditFormInfoMessage", "");
		pageSession.set("adminConsultantTypesEditEditFormErrorMessage", "");
		
		var self = this;

		function submitAction(msg) {
			var adminConsultantTypesEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(adminConsultantTypesEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminConsultantTypesEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.consultant_types", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminConsultantTypesEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				ConsultantType.update({ _id: t.data.edit_consultant_type._id }, { $set: values }, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("admin.consultant_types", {});
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

Template.AdminConsultantTypesEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminConsultantTypesEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminConsultantTypesEditEditFormErrorMessage");
	}
	
});
