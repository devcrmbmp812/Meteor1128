this.AdminSupplierTypesController = RouteController.extend({
	template: "Admin",


	yieldTemplates: {
		'AdminSupplierTypes': { to: 'AdminSubcontent'}

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
			Meteor.subscribe("admin_supplier_type")
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
			admin_supplier_type: SupplierType.find({}, {sort: ["name","asc"]})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});