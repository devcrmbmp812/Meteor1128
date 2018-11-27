IndustrySubSector.allow({
	insert: function (userId, doc) {
		return IndustrySubSector.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return IndustrySubSector.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return IndustrySubSector.userCanRemove(userId, doc);
	}
});

IndustrySubSector.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.user) doc.user = userId;
});

IndustrySubSector.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

IndustrySubSector.before.remove(function(userId, doc) {
	
});

IndustrySubSector.after.insert(function(userId, doc) {
	
});

IndustrySubSector.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

IndustrySubSector.after.remove(function(userId, doc) {
	
});
