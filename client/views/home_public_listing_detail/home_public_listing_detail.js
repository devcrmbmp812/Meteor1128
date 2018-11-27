var pageSession = new ReactiveDict();

Template.HomePublicListingDetail.rendered = function() {
	console.log('location', Session.get("location"));
};

Template.HomePublicListingDetail.events({
	"click #request_info": function(e, t) {
		e.preventDefault();
		console.log(this.params.listingId);
		if (!Meteor.userId())
			Modal.show("modalLogin");
		else
			Router.go("contact_listing_provider", {listingId: this.params.listingId});
		return false;
	}
});

Template.HomePublicListingDetail.helpers({

});

Template.HomePublicListingDetailListings.helpers({
	logoImage: function (img) {
		return (!img || img.length == 0) ? '/images/logo-placeholder.png' : Meteor.settings.public.site_host + "/" + img[0].path;
	},
	imagesExist: function () {
		if (this.admin_listings.images.length > 0)
			return true;
		return false;
	},
	isNotEmpty: function(type) {
		var office_location = _.where(this.admin_listings.office_locations, {head_quarter: 'on'});
		return (office_location[0][type] && office_location[0][type] != "") ? true : false;
	},
	getPhoneNumber: function() {
		var office_location = _.where(this.admin_listings.office_locations, {head_quarter: 'on'});
		return office_location[0].phone;
	},
	getMobileNumber: function() {
		var office_location = _.where(this.admin_listings.office_locations, {head_quarter: 'on'});
		return office_location[0].mobile;
	},
	getSkype: function() {
		var office_location = _.where(this.admin_listings.office_locations, {head_quarter: 'on'});
		console.log(office_location[0].phone);
		return office_location[0].skype;
	},
	getAddress: function() {
		var office_location = _.where(this.admin_listings.office_locations, {head_quarter: 'on'});
		console.log(office_location[0].phone);
		return office_location[0].address + ', ' + office_location[0].address_2 + ', '
		 + office_location[0].state + ', ' + office_location[0].postcode;
	},
	getWebsite: function(website) {
		console.log(website);
		return (website.indexOf("http://") > -1) ? website : 'http://' + website;
	}
});

Template.DetailListingBackButton.events({
	'click #form-back-button': function (e) {
		e.preventDefault();
		if (Session.get("urlQuery") != "")
			Router.go("home_public_search_results", {}, {query: Session.get("urlQuery")});
		else
			Router.go('user.search_business');
	}
})
