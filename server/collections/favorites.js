Favorites.allow({
	insert: function (userId, doc) {
		return Favorites.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Favorites.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Favorites.userCanRemove(userId, doc);
	}
});

Favorites.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;


	if(!doc.user) doc.user = userId;
});

Favorites.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;


});

Favorites.before.remove(function(userId, doc) {

});

Favorites.after.insert(function(userId, doc) {

});

Favorites.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Favorites.after.remove(function(userId, doc) {

});
