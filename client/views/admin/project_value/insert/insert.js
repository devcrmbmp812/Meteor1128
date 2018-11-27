var pageSession = new ReactiveDict();

Template.AdminProjectValueInsert.rendered = function() {
	
};

Template.AdminProjectValueInsert.events({
	
});

Template.AdminProjectValueInsert.helpers({
	
});

Template.AdminProjectValueInsertInsertForm.rendered = function() {
	

	pageSession.set("adminProjectValueInsertInsertFormInfoMessage", "");
	pageSession.set("adminProjectValueInsertInsertFormErrorMessage", "");

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

Template.AdminProjectValueInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminProjectValueInsertInsertFormInfoMessage", "");
		pageSession.set("adminProjectValueInsertInsertFormErrorMessage", "");
		
		var self = this;

		function submitAction(msg) {
			var adminProjectValueInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminProjectValueInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminProjectValueInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.project_value", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminProjectValueInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = ProjectValue.insert(values, function(e) { if(e) errorAction(e.message); else submitAction(); });
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

Template.AdminProjectValueInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminProjectValueInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminProjectValueInsertInsertFormErrorMessage");
	}
	
});
