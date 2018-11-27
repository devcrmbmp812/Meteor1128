this.SupplierType = new Mongo.Collection("supplier_type");

this.SupplierType.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin"]);
}

this.SupplierType.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}

this.SupplierType.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}
