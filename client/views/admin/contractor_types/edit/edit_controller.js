this.AdminContractorTypesEditController = RouteController.extend({
	template: "Admin",


	yieldTemplates: {
		'AdminContractorTypesEdit': { to: 'AdminSubcontent'}

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
			Meteor.subscribe("edit_contractor_type", this.params.ctId)
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
			edit_contractor_type: ContractorType.findOne({_id:this.params.ctId}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});