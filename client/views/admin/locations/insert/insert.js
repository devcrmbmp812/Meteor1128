var pageSession = new ReactiveDict();

Template.AdminLocationsInsert.rendered = function() {

};

Template.AdminLocationsInsert.events({

});

Template.AdminLocationsInsert.helpers({

});

Template.AdminLocationsInsertInsertForm.rendered = function() {


	pageSession.set("adminLocationsInsertInsertFormInfoMessage", "");
	pageSession.set("adminLocationsInsertInsertFormErrorMessage", "");

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

Template.AdminLocationsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminLocationsInsertInsertFormInfoMessage", "");
		pageSession.set("adminLocationsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminLocationsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminLocationsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminLocationsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.locations", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminLocationsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {
				console.log(fieldName, fieldValue);
			},
			function(msg) {

			},
			function(values) {
				var tmp = values.regions.split('\n');
				values.regions = tmp;
				console.log(values);

				newId = Locations.insert(values, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();



		Router.go("admin.locations", {});
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

Template.AdminLocationsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminLocationsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminLocationsInsertInsertFormErrorMessage");
	}

});
