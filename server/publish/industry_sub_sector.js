Meteor.publish("admin_industry_sub_sector", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return IndustrySubSector.publishJoinedCursors(IndustrySubSector.find({}, {}));
	}
	return this.ready();
});

Meteor.publish("insert_industry_sub_sector", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return IndustrySubSector.publishJoinedCursors(IndustrySubSector.find({_id:null}, {}));
	}
	return this.ready();
});

Meteor.publish("edit_industry_sub_sector", function(id) {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return IndustrySubSector.publishJoinedCursors(IndustrySubSector.find({_id:id}, {}));
	}
	return this.ready();
});

Meteor.publish("industry_sub_sector", function() {
	return IndustrySubSector.publishJoinedCursors(IndustrySubSector.find({}, {}));
});

