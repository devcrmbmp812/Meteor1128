Template.editAddress.rendered = function (){
	console.log(Session.get("currentAddress"));
};

Template.editAddress.helpers({
	address: function () {
		return Session.get("currentAddress");
	},
	getLocations: function() {
		var cursor = Locations.find({}, {sort: {state: 1}});
		var list = cursor.fetch();
		console.log(list);
		return list;
	},

	isChecked: function (val) {
		return val == "on" ? "checked" : "unchecked";
	},

	isSelected: function (left, right) {
		console.log(left, right);
		return left == right ? true : false;
	}

});

Template.editAddress.events({
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
				console.log(values);
				var obj = {};
				obj['office_locations.' + Session.get("currentAddressIndex")] = values;
				console.log(obj);
				console.log(JSON.stringify([{ _id: _id }, {$set: obj}]));
				Listing.update({ _id: _id }, {$set: obj}, function (err, obj) {
					console.log(err);
					console.log(obj);
				} );
				Modal.hide("editAddress");
			}
		);
	}
});