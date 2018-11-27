this.IndustrySubSector = new Mongo.Collection("industry_sub_sector");

this.IndustrySubSector.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin"]);
}

this.IndustrySubSector.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}

this.IndustrySubSector.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}
