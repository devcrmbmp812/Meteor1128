var pageSession = new ReactiveDict();

Template.AdminContractorTypesInsert.rendered = function() {

};

Template.AdminContractorTypesInsert.events({

});

Template.AdminContractorTypesInsert.helpers({

});

Template.AdminContractorTypesInsertInsertForm.rendered = function() {


	pageSession.set("adminContractorTypesInsertInsertFormInfoMessage", "");
	pageSession.set("adminContractorTypesInsertInsertFormErrorMessage", "");

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

Template.AdminContractorTypesInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminContractorTypesInsertInsertFormInfoMessage", "");
		pageSession.set("adminContractorTypesInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminContractorTypesInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminContractorTypesInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminContractorTypesInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.contractor_types", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminContractorTypesInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {

				if(values.contractor_types) {
					var tmp = values.contractor_types.split('\n');
					console.log(tmp);
					_.forEach(tmp, function (value) {
						console.log(value);
						ContractorType.insert({name: value}, function (e) {
							if (e) errorAction(e.message);
						});
					});
					submitAction();
				} else {
					newId = ContractorType.insert(values, function(e) { if(e) errorAction(e.message); else submitAction(); });
				}
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();



		Router.go("admin.contractor_types", {});
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

Template.AdminContractorTypesInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminContractorTypesInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminContractorTypesInsertInsertFormErrorMessage");
	}

});
