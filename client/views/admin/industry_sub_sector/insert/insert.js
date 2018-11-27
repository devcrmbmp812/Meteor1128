var pageSession = new ReactiveDict();

Template.AdminIndustrySubSectorInsert.rendered = function() {
	
};

Template.AdminIndustrySubSectorInsert.events({
	
});

Template.AdminIndustrySubSectorInsert.helpers({
	
});

Template.AdminIndustrySubSectorInsertInsertForm.rendered = function() {
	

	pageSession.set("adminIndustrySubSectorInsertInsertFormInfoMessage", "");
	pageSession.set("adminIndustrySubSectorInsertInsertFormErrorMessage", "");

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

Template.AdminIndustrySubSectorInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminIndustrySubSectorInsertInsertFormInfoMessage", "");
		pageSession.set("adminIndustrySubSectorInsertInsertFormErrorMessage", "");
		
		var self = this;

		function submitAction(msg) {
			var adminIndustrySubSectorInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminIndustrySubSectorInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminIndustrySubSectorInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.industry_sub_sector", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminIndustrySubSectorInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = IndustrySubSector.insert(values, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("admin.industry_sub_sector", {});
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

Template.AdminIndustrySubSectorInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminIndustrySubSectorInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminIndustrySubSectorInsertInsertFormErrorMessage");
	}
	
});
