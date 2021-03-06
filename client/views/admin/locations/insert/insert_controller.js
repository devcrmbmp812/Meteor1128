this.AdminLocationsInsertController = RouteController.extend({
	template: "Admin",


	yieldTemplates: {
		'AdminLocationsInsert': { to: 'AdminSubcontent'}

	},

	onBeforeAction: function() {
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("Admin"); this.render("loading", { to: "AdminSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {


		var subs = [
			Meteor.subscribe("insert_location")
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
			insert_location: Locations.findOne({_id:null}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});