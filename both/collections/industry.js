this.Industry = new Mongo.Collection("industry");

this.Industry.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin"]);
}

this.Industry.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}

this.Industry.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}
