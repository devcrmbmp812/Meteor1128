var pageSession = new ReactiveDict();

Template.AdminProjectTeamLocationInsert.rendered = function() {
	
};

Template.AdminProjectTeamLocationInsert.events({
	
});

Template.AdminProjectTeamLocationInsert.helpers({
	
});

Template.AdminProjectTeamLocationInsertInsertForm.rendered = function() {
	

	pageSession.set("adminProjectTeamLocationInsertInsertFormInfoMessage", "");
	pageSession.set("adminProjectTeamLocationInsertInsertFormErrorMessage", "");

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

Template.AdminProjectTeamLocationInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminProjectTeamLocationInsertInsertFormInfoMessage", "");
		pageSession.set("adminProjectTeamLocationInsertInsertFormErrorMessage", "");
		
		var self = this;

		function submitAction(msg) {
			var adminProjectTeamLocationInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminProjectTeamLocationInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminProjectTeamLocationInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.project_team_location", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminProjectTeamLocationInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = ProjectTeamLocation.insert(values, function(e) { if(e) errorAction(e.message); else submitAction(); });
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

Template.AdminProjectTeamLocationInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminProjectTeamLocationInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminProjectTeamLocationInsertInsertFormErrorMessage");
	}
	
});
