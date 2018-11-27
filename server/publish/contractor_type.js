Meteor.publish("admin_contractor_type", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return ContractorType.find({}, {});
	}
	return this.ready();
});

Meteor.publish("insert_contractor_type", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return ContractorType.find({_id:null}, {});
	}
	return this.ready();
});

Meteor.publish("edit_contractor_type", function(ctId) {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return ContractorType.find({_id:ctId}, {});
	}
	return this.ready();
});

Meteor.publish("contractor_types", function() {
	return ContractorType.find({}, {});
});

