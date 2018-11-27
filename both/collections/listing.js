this.Listing = new Mongo.Collection("listing");

this.Listing.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","customer", "user"]);
}

this.Listing.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","customer", "user"]);
}

this.Listing.userCanUpsert = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","customer", "user"]);
}

this.Listing.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin", "customer", "user"]);
}
