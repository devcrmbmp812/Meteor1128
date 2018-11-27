this.SearchBusinessListingsController = RouteController.extend({
	template: "HomePrivate",


	yieldTemplates: {
		'SearchBusinessListings': { to: 'HomePrivateSubcontent'}

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
			Meteor.subscribe("admin_listings")
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
			admin_listings: Listing.find({status: 'active'}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});