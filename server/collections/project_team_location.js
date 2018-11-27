ProjectTeamLocation.allow({
	insert: function (userId, doc) {
		return ProjectTeamLocation.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return ProjectTeamLocation.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return ProjectTeamLocation.userCanRemove(userId, doc);
	}
});

ProjectTeamLocation.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.user) doc.user = userId;
});

ProjectTeamLocation.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

ProjectTeamLocation.before.remove(function(userId, doc) {
	
});

ProjectTeamLocation.after.insert(function(userId, doc) {
	
});

ProjectTeamLocation.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

ProjectTeamLocation.after.remove(function(userId, doc) {
	
});
