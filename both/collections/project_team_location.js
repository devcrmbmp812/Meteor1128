this.ProjectTeamLocation = new Mongo.Collection("project_team_location");

this.ProjectTeamLocation.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin"]);
}

this.ProjectTeamLocation.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}

this.ProjectTeamLocation.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}
