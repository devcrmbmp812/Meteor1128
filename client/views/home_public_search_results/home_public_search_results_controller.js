this.HomePublicSearchResultsController = RouteController.extend({
	template: "HomePublicSearchResults",


	yieldTemplates: {
		/*YIELD_TEMPLATES*/
		'HomePublicSearchResultsListings': { to: 'HomePublicSearchResultsSubcontent'}
	},

	onBeforeAction: function() {
		/*BEFORE_FUNCTION*/
		this.next();
	},

	waitOn: function() {


		var subs = [
			Meteor.subscribe("admin_listings"),
			Meteor.subscribe("consultant_types"),
			Meteor.subscribe("contractor_types"),
			Meteor.subscribe("supplier_types"),
			Meteor.subscribe("project_value"),
			Meteor.subscribe("industry"),
			Meteor.subscribe("industry_sub_sector"),
			Meteor.subscribe("project_team_location"),
			Meteor.subscribe("locations"),
			Meteor.subscribe('favorites')
		];
		return subs;
	},

	data: function() {


		return {
			params: this.params || {},
			consultant_types: ConsultantType.find({}, {sort: ["name","asc"]}),
			contractor_types: ContractorType.find({}, {sort: { name: 1 }}),
			supplier_types: SupplierType.find({}, {sort: { name: 1 }}),
			project_value: ProjectValue.find({}, {sort: {value: 1}}),
			industry: Industry.find({}, {sort: ["name","asc"]}),
			industry_sub_sector: IndustrySubSector.find({}, {}),
			project_team_location: ProjectTeamLocation.find({},{sort: ["name","asc"]}),
			admin_listings: Listing.find({status: 'active'}, {sort: {createdAt: -1}}),
			location: Locations.findOne({state:this.params.query.location}, {})		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});