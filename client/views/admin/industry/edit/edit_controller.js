this.AdminIndustryEditController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminIndustryEdit': { to: 'AdminSubcontent'}
		
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
			Meteor.subscribe("edit_industry", this.params.id)
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
			edit_industry: Industry.findOne({_id:this.params.id}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});