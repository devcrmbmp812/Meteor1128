Uploads.allow({
  insert: function (userId, doc) {
    return Uploads.userCanInsert(userId, doc);
  },
  update: function (userId, doc, fields, modifier) {
    return Uploads.userCanUpdate(userId, doc);
  }
});