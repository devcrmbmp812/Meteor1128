this.CommencementDate = new Mongo.Collection("commencement_date");

this.CommencementDate.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin"]);
}

this.CommencementDate.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}

this.CommencementDate.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}
