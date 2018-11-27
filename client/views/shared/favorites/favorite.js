Template.favoriteButton.helpers({
  isFavorite: function(_id) {
    return Favorites.findOne({
      doc: _id,
      owner: Meteor.userId()
    });
  }
});

Template.favoriteButtonNotFavorited.events({
  'click .favorite-button': function(e, t) {
    if (!Meteor.userId()) {
      Modal.show('modalLogin');
    } else {
      return Favorites.insert({
        doc: $(e.currentTarget).attr('doc'),
        owner: Meteor.userId()
      });
    }
  }
});

Template.favoriteButtonFavorited.events({
  'click .favorite-button': function(e, t) {
    var favorite;
    favorite = Favorites.findOne({
      owner: Meteor.userId(),
      doc: $(e.currentTarget).attr('doc')
    });
    return Favorites.remove({
      _id: favorite._id
    });
  }
});