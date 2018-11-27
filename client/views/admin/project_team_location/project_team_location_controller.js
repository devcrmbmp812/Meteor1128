this.AdminProjectTeamLocationController = RouteController.extend({
	template: "Admin",


	yieldTemplates: {
		'AdminProjectTeamLocation': { to: 'AdminSubcontent'}

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
			Meteor.subscribe("admin_project_team_location")
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
			admin_project_team_location: ProjectTeamLocation.find({}, {sort: ["name","asc"]})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});