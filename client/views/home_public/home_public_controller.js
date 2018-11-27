this.HomePublicController = RouteController.extend({
	template: "HomePublic",


	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {


		var subs = [
			Meteor.subscribe("locations"),
			Meteor.subscribe("home_page")
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
			locations: Locations.find({}, {}),
			home_page: Cms.findOne({name:"home_page"}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});