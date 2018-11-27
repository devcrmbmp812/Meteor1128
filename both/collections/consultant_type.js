this.ConsultantType = new Mongo.Collection("consultant_type");

this.ConsultantType.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin"]);
}

this.ConsultantType.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}

this.ConsultantType.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}
