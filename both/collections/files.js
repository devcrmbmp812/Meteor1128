this.Files = new FS.Collection("files", {
	stores: [new FS.Store.GridFS("files")]
});

this.Files.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","customer", "user"]);
};

this.Files.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","customer", "user"]);
};

this.Files.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","customer", "user"]);
};

this.Files.userCanDownload = function(userId, doc) {
	return true;
};

