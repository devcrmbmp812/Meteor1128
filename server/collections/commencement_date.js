CommencementDate.allow({
	insert: function (userId, doc) {
		return CommencementDate.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return CommencementDate.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return CommencementDate.userCanRemove(userId, doc);
	}
});

CommencementDate.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.user) doc.user = userId;
});

CommencementDate.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

CommencementDate.before.remove(function(userId, doc) {
	
});

CommencementDate.after.insert(function(userId, doc) {
	
});

CommencementDate.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

CommencementDate.after.remove(function(userId, doc) {
	
});
