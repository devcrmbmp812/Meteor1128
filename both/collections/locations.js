this.Locations = new Mongo.Collection("locations");

this.Locations.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","customer", "user"]);
}

this.Locations.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","customer", "user"]);
}


this.Locations.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}
