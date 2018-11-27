Meteor.publish("admin_project_value", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return ProjectValue.find({}, {});
	}
	return this.ready();
});

Meteor.publish("insert_project_value", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return ProjectValue.find({_id:null}, {});
	}
	return this.ready();
});

Meteor.publish("edit_project_value", function(id) {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return ProjectValue.find({_id:id}, {});
	}
	return this.ready();
});

Meteor.publish("project_value", function() {
	return ProjectValue.find({}, {});
});

