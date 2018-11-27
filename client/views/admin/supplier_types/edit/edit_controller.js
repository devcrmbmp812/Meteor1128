this.AdminSupplierTypesEditController = RouteController.extend({
	template: "Admin",


	yieldTemplates: {
		'AdminSupplierTypesEdit': { to: 'AdminSubcontent'}

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
			Meteor.subscribe("edit_supplier_type", this.params.ctId)
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
			edit_supplier_type: SupplierType.findOne({_id:this.params.ctId}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});