var pageSession = new ReactiveDict();

Template.UserListingDetail.rendered = function() {
	console.log('location', Session.get("location"));
};

Template.UserListingDetailItem.events({
	"click #request_info": function(e, t) {
		e.preventDefault();
		console.log(this.params.listingId);
		//Router.go("user.listing_detail", {listingId: this.params.listingId});
		return false;
	}
});

Template.UserListingDetail.helpers({

});

Template.UserListingDetailItem.helpers({
	logoImage: function (img) {
		console.log(img)
		return img.length == 0 ? '' : img[0].url;
	},
	imagesExist: function () {
		if (this.admin_listings.images.length > 0)
			return true;
		return false;
	},
	getPhoneNumber: function() {
		var office_location = _.where(this.admin_listings.office_locations, {head_quarter: 'yes'});
		return office_location[0].phone;
	},
	getMobileNumber: function() {
		var office_location = _.where(this.admin_listings.office_locations, {head_quarter: 'yes'});
		return office_location[0].mobile;
	},
	getSkype: function() {
		var office_location = _.where(this.admin_listings.office_locations, {head_quarter: 'yes'});
		console.log(office_location[0].phone);
		return office_location[0].skype;
	},
	getAddress: function() {
		var office_location = _.where(this.admin_listings.office_locations, {head_quarter: 'yes'});
		console.log(office_location[0].phone);
		return office_location[0].address + ', ' + office_location[0].address_2 + ', '
		 + office_location[0].state + ', ' + office_location[0].postcode;
	}
});
