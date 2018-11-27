Meteor.publish('favorites', function() {
  return Favorites.find();
});

Meteor.publish('favoritesByUser', function(_id) {
  return Favorites.find({
    owner: _id
  });
});;