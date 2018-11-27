this.HomePublicListingDetailController = RouteController.extend({
	template: "HomePublicListingDetail",


	yieldTemplates: {
		/*YIELD_TEMPLATES*/
		'HomePublicListingDetailListings': { to: 'HomePublicListingDetailSubcontent'}
	},

	onBeforeAction: function() {
		/*BEFORE_FUNCTION*/
		this.next();
	},

	waitOn: function() {


		var subs = [
			Meteor.subscribe("admin_listings"),
			Meteor.subscribe("consultant_types"),
			Meteor.subscribe("project_value"),
			Meteor.subscribe("industry"),
			Meteor.subscribe("industry_sub_sector"),
			Meteor.subscribe("project_team_location"),
			Meteor.subscribe('favorites')
		];
		return subs;
	},

	data: function() {


		return {
			params: this.params || {},
			consultant_types: ConsultantType.find({}, {sort: ["name","asc"]}),
			project_value: ProjectValue.find({}, {sort: {value: 1}}),
			industry: Industry.find({}, {sort: ["name","asc"]}),
			industry_sub_sector: IndustrySubSector.find({}, {}),
			project_team_location: ProjectTeamLocation.find({}, {sort: ["name","asc"]}),
			admin_listings: Listing.findOne({_id:this.params.listingId}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});