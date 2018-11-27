Meteor.publish("about_us", function() {
	//if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Cms.find({name:"about_us"}, {});
	//}
	//return this.ready();
});
Meteor.publish("contact_us", function() {
	//if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Cms.find({name:"contact_us"}, {});
	//}
	//return this.ready();
});
Meteor.publish("privacy_policy", function() {
	//if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Cms.find({name:"privacy_policy"}, {});
	//}
	//return this.ready();
});

Meteor.publish("home_page", function() {
	//if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Cms.find({name:"home_page"}, {});
	//}
	//return this.ready();
});
Meteor.publish("public_cms", function() {
		return Cms.find({}, {});
});

Meteor.publish("cms", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Cms.find({}, {});
	}
	return this.ready();
});

Meteor.publish("insert_cms", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Cms.find({_id:null}, {});
	}
	return this.ready();
});

Meteor.publish("edit_cms", function(id) {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Cms.find({_id:id}, {});
	}
	return this.ready();
});

