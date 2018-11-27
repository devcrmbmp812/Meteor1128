var pageSession = new ReactiveDict();

Template.AdminProjectTeamLocationEdit.rendered = function() {
	
};

Template.AdminProjectTeamLocationEdit.events({
	
});

Template.AdminProjectTeamLocationEdit.helpers({
	
});

Template.AdminProjectTeamLocationEditEditForm.rendered = function() {
	

	pageSession.set("adminProjectTeamLocationEditEditFormInfoMessage", "");
	pageSession.set("adminProjectTeamLocationEditEditFormErrorMessage", "");

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

Template.AdminProjectTeamLocationEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminProjectTeamLocationEditEditFormInfoMessage", "");
		pageSession.set("adminProjectTeamLocationEditEditFormErrorMessage", "");
		
		var self = this;

		function submitAction(msg) {
			var adminProjectTeamLocationEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(adminProjectTeamLocationEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminProjectTeamLocationEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.project_team_location", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminProjectTeamLocationEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				ProjectTeamLocation.update({ _id: t.data.edit_project_team_location._id }, { $set: values }, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("admin.project_team_location", {});
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

Template.AdminProjectTeamLocationEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminProjectTeamLocationEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminProjectTeamLocationEditEditFormErrorMessage");
	}
	
});
