Meteor.publish("admin_listings", function() {
		return Listing.publishJoinedCursors(Listing.find({}, {}));
});

Meteor.publish("user_listings", function(customerId) {
		return Listing.publishJoinedCursors(Listing.find({customer: customerId}, {}));
});

Meteor.publish("insert_listing", function() {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Listing.publishJoinedCursors(Listing.find({_id:null}, {}));
	}
	return this.ready();
});

Meteor.publish("edit_listing", function(id) {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Listing.publishJoinedCursors(Listing.find({_id:id}, {}));
	}
	return this.ready();
});

Meteor.publish("edit_listing_user", function(id) {
	if(Users.isInRoles(this.userId, ["admin","customer","user"])) {
		return Users.find({_id:id}, {});
	}
	return this.ready();
});