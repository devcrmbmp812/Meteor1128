var pageSession = new ReactiveDict();

Template.AdminSupplierTypesInsert.rendered = function() {

};

Template.AdminSupplierTypesInsert.events({

});

Template.AdminSupplierTypesInsert.helpers({

});

Template.AdminSupplierTypesInsertInsertForm.rendered = function() {


	pageSession.set("adminSupplierTypesInsertInsertFormInfoMessage", "");
	pageSession.set("adminSupplierTypesInsertInsertFormErrorMessage", "");

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

Template.AdminSupplierTypesInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminSupplierTypesInsertInsertFormInfoMessage", "");
		pageSession.set("adminSupplierTypesInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminSupplierTypesInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminSupplierTypesInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminSupplierTypesInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.supplier_types", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminSupplierTypesInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {

				if(values.supplier_types) {
					var tmp = values.supplier_types.split('\n');
					console.log(tmp);
					// _.forEach(tmp, function (value) {
					// 	console.log(value);
					// 	SupplierType.insert({name: value}, function (e) {
					// 		if (e) errorAction(e.message);
					// 	});
					// });
				// 	submitAction();
				// } else {
					newId = SupplierType.insert({name: values.name, supplier_types: tmp}, function(e) { if(e) errorAction(e.message); else submitAction(); });
				}
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();



		Router.go("admin.supplier_types", {});
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

Template.AdminSupplierTypesInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminSupplierTypesInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminSupplierTypesInsertInsertFormErrorMessage");
	}

});
