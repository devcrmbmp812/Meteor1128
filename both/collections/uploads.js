this.Uploads = new Mongo.Collection("uploads");

this.Uploads.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","customer", "user"]);
};

this.Uploads.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","customer", "user"]);
};

this.Uploads.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","customer", "user"]);
};

this.Uploads.userCanDownload = function(userId, doc) {
	return true;
};

