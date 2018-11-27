var pageSession = new ReactiveDict();

Template.AdminCmsInsert.rendered = function() {

};

Template.AdminCmsInsert.events({

});

Template.AdminCmsInsert.helpers({

});

Template.AdminCmsInsertInsertForm.rendered = function() {

	$('#summernote').summernote();
	pageSession.set("adminCmsInsertInsertFormInfoMessage", "");
	pageSession.set("adminCmsInsertInsertFormErrorMessage", "");

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

Template.AdminCmsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminCmsInsertInsertFormInfoMessage", "");
		pageSession.set("adminCmsInsertInsertFormErrorMessage", "");
		var sHTML = $('#summernote').code();
		$("textarea#content").html(sHTML);

		var self = this;

		function submitAction(msg) {
			var adminCmsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminCmsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminCmsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.cms", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminCmsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {


				newId = Cms.insert(values, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();



		Router.go("admin.cms", {});
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

Template.AdminCmsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminCmsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminCmsInsertInsertFormErrorMessage");
	}

});
