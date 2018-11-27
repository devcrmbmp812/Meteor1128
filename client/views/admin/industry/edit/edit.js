var pageSession = new ReactiveDict();

Template.AdminIndustryEdit.rendered = function() {

};

Template.AdminIndustryEdit.events({

});

Template.AdminIndustryEdit.helpers({

});

Template.AdminIndustryEditEditForm.rendered = function() {


	pageSession.set("adminIndustryEditEditFormInfoMessage", "");
	pageSession.set("adminIndustryEditEditFormErrorMessage", "");

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

Template.AdminIndustryEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminIndustryEditEditFormInfoMessage", "");
		pageSession.set("adminIndustryEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminIndustryEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(adminIndustryEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminIndustryEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.industry", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminIndustryEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				//var tmp = values.industry_sub_sector.split(',');
				//values.industry_sub_sector = tmp;

				Industry.update({ _id: t.data.edit_industry._id }, { $set: values }, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();



		Router.go("admin.industry", {});
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

Template.AdminIndustryEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminIndustryEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminIndustryEditEditFormErrorMessage");
	}

});
