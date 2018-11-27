ConsultantType.allow({
	insert: function (userId, doc) {
		return ConsultantType.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return ConsultantType.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return ConsultantType.userCanRemove(userId, doc);
	}
});

ConsultantType.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.user) doc.user = userId;
});

ConsultantType.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

ConsultantType.before.remove(function(userId, doc) {
	
});

ConsultantType.after.insert(function(userId, doc) {
	
});

ConsultantType.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

ConsultantType.after.remove(function(userId, doc) {
	
});
