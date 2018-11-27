Template.UserFavoritesListingsViewItem.events({
	"click #more-button": function(e, t) {
		e.preventDefault();
		//Router.go("user.listing_detail", {listingId: this._id});
		Router.go("home_public_listing_detail", {listingId: this._id});
		return false;
	},
});

Template.UserFavoritesListingsViewItem.helpers({
	logoImage: function (img) {
		return (!img || img.length == 0) ? '/images/logo-placeholder.png' : Meteor.settings.public.site_host + "/" + img[0].path;
	},
	isLocationMatch: function (areas) {
		return _.contains(areas, pageSession.get("location"));
	},
	isSubSectorMatch: function (areas) {
		return _.contains(areas, pageSession.get("industry_sub_sector"));
	},
	isSectorMatch: function (areas) {
		return _.contains(areas, pageSession.get("industry"));
	},
	isProjectValueMatch: function(minProjectValue, maxProjectValue) {
		var project_value = parseInt(pageSession.get("project_value"));
		return ((project_value >= parseInt(minProjectValue)) && (project_value <= parseInt(maxProjectValue)));
	}
})

