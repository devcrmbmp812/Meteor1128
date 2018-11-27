this.ProjectValue = new Mongo.Collection("project_value");

this.ProjectValue.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin"]);
}

this.ProjectValue.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}

this.ProjectValue.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}
