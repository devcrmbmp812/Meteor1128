this.ContractorType = new Mongo.Collection("contractor_type");

this.ContractorType.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin"]);
}

this.ContractorType.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}

this.ContractorType.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}
