this.Favorites = new Mongo.Collection("favorites");

this.Favorites.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","customer", "user"]);
}

this.Favorites.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","customer", "user"]);
}


this.Favorites.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","customer", "user"]);
}
