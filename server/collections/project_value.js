ProjectValue.allow({
	insert: function (userId, doc) {
		return ProjectValue.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return ProjectValue.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return ProjectValue.userCanRemove(userId, doc);
	}
});

ProjectValue.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.user) doc.user = userId;
});

ProjectValue.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

ProjectValue.before.remove(function(userId, doc) {
	
});

ProjectValue.after.insert(function(userId, doc) {
	
});

ProjectValue.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

ProjectValue.after.remove(function(userId, doc) {
	
});
