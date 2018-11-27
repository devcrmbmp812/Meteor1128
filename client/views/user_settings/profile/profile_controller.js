this.UserSettingsProfileController = RouteController.extend({
	template: "HomePrivate",


	yieldTemplates: {
		'UserSettingsProfile': { to: 'HomePrivateSubcontent'}

	},

	onBeforeAction: function() {
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("UserSettingsProfile"); this.render("loading", { to: "HomePrivateSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {


		var subs = [

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
			current_user_data: Users.findOne({_id:Meteor.userId()}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});