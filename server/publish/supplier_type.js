Meteor.publish("admin_supplier_type", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return SupplierType.find({}, {});
	}
	return this.ready();
});

Meteor.publish("insert_supplier_type", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return SupplierType.find({_id:null}, {});
	}
	return this.ready();
});

Meteor.publish("edit_supplier_type", function(ctId) {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return SupplierType.find({_id:ctId}, {});
	}
	return this.ready();
});

Meteor.publish("supplier_types", function() {
	return SupplierType.find({}, {});
});

