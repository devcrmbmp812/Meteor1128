Cms.allow({
	insert: function (userId, doc) {
		return Cms.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Cms.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Cms.userCanRemove(userId, doc);
	}
});

Cms.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.user) doc.user = userId;
});

Cms.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Cms.before.remove(function(userId, doc) {
	
});

Cms.after.insert(function(userId, doc) {
	
});

Cms.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Cms.after.remove(function(userId, doc) {
	
});
