Listing.allow({
	insert: function (userId, doc) {
		return Listing.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Listing.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Listing.userCanRemove(userId, doc);
	}
});

Listing.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.customer) doc.customer = userId;
});

Listing.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Listing.before.remove(function(userId, doc) {
	
});

Listing.after.insert(function(userId, doc) {
	
});

Listing.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Listing.after.remove(function(userId, doc) {
	
});
