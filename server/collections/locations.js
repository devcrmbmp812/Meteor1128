Locations.allow({
	insert: function (userId, doc) {
		return Locations.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Locations.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Locations.userCanRemove(userId, doc);
	}
});

Locations.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;


	if(!doc.user) doc.user = userId;
});

Locations.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;


});

Locations.before.remove(function(userId, doc) {

});

Locations.after.insert(function(userId, doc) {

});

Locations.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Locations.after.remove(function(userId, doc) {

});
