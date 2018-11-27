var pageSession = new ReactiveDict();

Template.AdminConsultantTypesInsert.rendered = function() {

};

Template.AdminConsultantTypesInsert.events({

});

Template.AdminConsultantTypesInsert.helpers({

});

Template.AdminConsultantTypesInsertInsertForm.rendered = function() {


	pageSession.set("adminConsultantTypesInsertInsertFormInfoMessage", "");
	pageSession.set("adminConsultantTypesInsertInsertFormErrorMessage", "");

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

Template.AdminConsultantTypesInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminConsultantTypesInsertInsertFormInfoMessage", "");
		pageSession.set("adminConsultantTypesInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminConsultantTypesInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminConsultantTypesInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminConsultantTypesInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.consultant_types", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminConsultantTypesInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {

				if(values.consultant_types) {
					var tmp = values.consultant_types.split('\n');
					console.log(tmp);
					_.forEach(tmp, function (value) {
						console.log(value);
						ConsultantType.insert({name: value}, function (e) {
							if (e) errorAction(e.message);
						});
					});
					submitAction();
				} else {
					newId = ConsultantType.insert(values, function(e) { if(e) errorAction(e.message); else submitAction(); });
				}
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

Template.AdminConsultantTypesInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminConsultantTypesInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminConsultantTypesInsertInsertFormErrorMessage");
	}

});
