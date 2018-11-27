this.AdminIndustryController = RouteController.extend({
	template: "Admin",


	yieldTemplates: {
		'AdminIndustry': { to: 'AdminSubcontent'}

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
			Meteor.subscribe("admin_industry")
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
			admin_industry: Industry.find({}, {sort: ["name","asc"]})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});