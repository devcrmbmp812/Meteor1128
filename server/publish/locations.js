Meteor.publish("locations", function() {
	return Locations.find({}, {});
});

Meteor.publish("admin_locations", function() {
	return Locations.find({}, {});
});

Meteor.publish("insert_location", function() {
	if(Users.isInRoles(this.userId, ["admin"])) {
		return Locations.find({_id:null}, {});
	}
	return this.ready();
});

Meteor.publish("edit_location", function(id) {
	if(Users.isInRoles(this.userId, ["admin"])) {
		return Locations.find({_id:id}, {});
	}
	return this.ready();
});