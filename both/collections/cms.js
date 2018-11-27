this.Cms = new Mongo.Collection("cms");

this.Cms.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin"]);
}

this.Cms.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}

this.Cms.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}
