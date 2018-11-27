Template.uploadedInfo.helpers({

});

Template.uploadedInfo.events({
  'click .deleteUpload':function() {
  	console.log(this.name, Router.current().params.id);
  	var path = this.path.substring(0, 4);
  	console.log(path);
    if (confirm('Are you sure?')) {
      if (path == 'logo')
	      Meteor.call('deleteLogo', Router.current().params.id, this.name);
	  else
      	Meteor.call('deleteFile', Router.current().params.id, this.name);
    }
  }
});

