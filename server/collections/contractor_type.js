ContractorType.allow({
	insert: function (userId, doc) {
		return ContractorType.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return ContractorType.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return ContractorType.userCanRemove(userId, doc);
	}
});

ContractorType.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;


	if(!doc.user) doc.user = userId;
});

ContractorType.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;


});

ContractorType.before.remove(function(userId, doc) {

});

ContractorType.after.insert(function(userId, doc) {

});

ContractorType.after.update(function(userId, doc, fieldNames, modifier, options) {

});

ContractorType.after.remove(function(userId, doc) {

});
