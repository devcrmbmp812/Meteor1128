Template.AddressListingsViewTable.rendered = function () {
	Session.set("currentListing", Router.current().params.id);
}

Template.AddressListingsViewTable.helpers({
	getArray: function() {
		console.log(Session.get("currentListing"));
	  var listing = Listing.findOne({_id: Session.get("currentListing")});
	  console.log('listing', listing);
	  var arr = (listing && listing.office_locations) ? listing.office_locations : [];
	  //console.log(arr);
	  return _.map(arr, function(value, index){
	    return {value: value, index: index};
	  });
	},
	isNotEmpty: function () {
	  var listing = Listing.findOne({_id: Session.get("currentListing")});
	  console.log('listing', listing);
	  var arr = (listing && listing.office_locations) ? listing.office_locations : [];
	  return arr.length > 0 ? true : false;
	}
})
Template.AddressListingsViewTableItems.events({
	"click .edit-button": function(e, t) {
		e.preventDefault();
		console.log(this.index);
		Session.set("currentListing", Router.current().params.id);
		Session.set("currentAddressIndex", this.index);
		Session.set("currentAddress", this.value);
		console.log('this', this);
		Modal.show("editAddress");
		return false;
	},
	"click .delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		var obj = {};
		obj['office_locations.' + this.index] = 1;
		bootbox.dialog({
			message: "Delete this address? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Listing.update({ _id: Router.current().params.id }, {$unset: obj});
						Listing.update({ _id: Router.current().params.id }, {$pull: {'office_locations': null}});
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
});
