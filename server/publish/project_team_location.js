Meteor.publish("admin_project_team_location", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return ProjectTeamLocation.find({}, {});
	}
	return this.ready();
});

Meteor.publish("insert_project_team_location", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return ProjectTeamLocation.find({_id:null}, {});
	}
	return this.ready();
});

Meteor.publish("edit_project_team_location", function(id) {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return ProjectTeamLocation.find({_id:id}, {});
	}
	return this.ready();
});

Meteor.publish("project_team_location", function() {
	return ProjectTeamLocation.find({}, {});
});

