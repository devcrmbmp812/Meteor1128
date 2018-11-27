Industry.allow({
	insert: function (userId, doc) {
		return Industry.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Industry.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Industry.userCanRemove(userId, doc);
	}
});

Industry.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.user) doc.user = userId;
});

Industry.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Industry.before.remove(function(userId, doc) {
	
});

Industry.after.insert(function(userId, doc) {
	
});

Industry.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Industry.after.remove(function(userId, doc) {
	
});
