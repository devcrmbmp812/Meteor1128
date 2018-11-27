Meteor.publish("admin_consultant_type", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return ConsultantType.find({}, {});
	}
	return this.ready();
});

Meteor.publish("insert_consultant_type", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return ConsultantType.find({_id:null}, {});
	}
	return this.ready();
});

Meteor.publish("edit_consultant_type", function(ctId) {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return ConsultantType.find({_id:ctId}, {});
	}
	return this.ready();
});

Meteor.publish("consultant_types", function() {
	return ConsultantType.find({}, {});
});

