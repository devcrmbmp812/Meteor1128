// Meteor.publish("edit_project_value", function(projectId) {
// 	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
// 		return Industry.find({_id:projectId}, {});
// 	}
// 	return this.ready();
// });

Meteor.publish("admin_industry", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Industry.find({}, {});
	}
	return this.ready();
});

Meteor.publish("insert_industry", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Industry.find({_id:null}, {});
	}
	return this.ready();
});

Meteor.publish("edit_industry", function(id) {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Industry.find({_id:id}, {});
	}
	return this.ready();
});

Meteor.publish("industry", function() {
	return Industry.find({}, {});
});

