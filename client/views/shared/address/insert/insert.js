Template.addNewAddress.rendered = function (){
	Session.set("currentListing", Router.current().params.id);
	console.log(Session.get("currentListing"));
};

Template.addNewAddress.helpers({
	getLocations: function() {
		var cursor = Locations.find({}, {sort: {state: 1}});
		var list = cursor.fetch();
		console.log(list);
		return list;
	}
});

Template.addNewAddress.events({
	'submit': function(e, t) {
		e.preventDefault();
		var self = this;
		console.log("submit");
		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {
			},
			function(values) {
				var _id = Session.get("currentListing");
				console.log(_id, values);
				Listing.update({ _id: _id }, { $push: { office_locations: values } });
				Modal.hide("addNewAddress");
			}
		);
	}
});