Template.registerHelper('uppercase', function(text) {
  return text.toUpperCase();
});

Template.registerHelper('imageUrl', function() {
	return Meteor.settings.public.site_host;
});