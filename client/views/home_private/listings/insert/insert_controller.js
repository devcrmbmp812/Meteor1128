this.UserInsertListingController = RouteController.extend({
	template: "HomePrivate",


	yieldTemplates: {
		'UserInsertListing': { to: 'HomePrivateSubcontent'}
	},

	onBeforeAction: function() {
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("HomePrivate"); this.render("loading", { to: "HomePrivateSubcontent" });}
		/*ACTION_FUNCTION*/
	},
	isReady: function() {


		var subs = [
			Meteor.subscribe("consultant_types"),
			Meteor.subscribe("contractor_types"),
			Meteor.subscribe("supplier_types"),
			Meteor.subscribe("project_value"),
			Meteor.subscribe("industry"),
			Meteor.subscribe("industry_sub_sector"),
			Meteor.subscribe("project_team_location"),
			Meteor.subscribe("edit_listing", this.params.id),
			Meteor.subscribe("insert_listing"),
			Meteor.subscribe("locations")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {


		return {
			params: this.params || {},
			consultant_types: ConsultantType.find({}, {sort: { name: 1 }}),
			contractor_types: ContractorType.find({}, {sort: { name: 1 }}),
			supplier_types: SupplierType.find({}, {sort: { name: 1 }}),
			locations: Locations.find({}, {sort: ["state","asc"]}),
			project_value: ProjectValue.find({}, {sort: { value: 1 }}),
			industry: Industry.find({}, {sort: { name: 1 }}),
			industry_sub_sector: IndustrySubSector.find({}, {}),
			edit_listing: Listing.findOne({_id:this.params.id}, {}),
			project_team_location: ProjectTeamLocation.find({}, {}),
			insert_listing: Listing.findOne({_id:this.params.id}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});