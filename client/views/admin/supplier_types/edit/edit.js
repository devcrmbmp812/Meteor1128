var pageSession = new ReactiveDict();

Template.AdminSupplierTypesEdit.rendered = function() {

};

Template.AdminSupplierTypesEdit.events({

});

Template.AdminSupplierTypesEdit.helpers({

});

Template.AdminSupplierTypesEditEditForm.rendered = function() {


	pageSession.set("adminSupplierTypesEditEditFormInfoMessage", "");
	pageSession.set("adminSupplierTypesEditEditFormErrorMessage", "");

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

Template.AdminSupplierTypesEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminSupplierTypesEditEditFormInfoMessage", "");
		pageSession.set("adminSupplierTypesEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminSupplierTypesEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(adminSupplierTypesEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminSupplierTypesEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.supplier_types", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminSupplierTypesEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				var tmp = values.supplier_types.split('\n');


				SupplierType.update({ _id: t.data.edit_supplier_type._id }, { $set: {name: values.name, supplier_types: tmp} }, function(e) { if(e) errorAction(e.message); else submitAction(); });
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

Template.AdminSupplierTypesEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminSupplierTypesEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminSupplierTypesEditEditFormErrorMessage");
	},
	"getSupplierTypes": function (types) {
		console.log(types);
		return types.toString().replace(/,/g, "\n");
	}
});
