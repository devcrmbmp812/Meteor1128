Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}
	process.env.MAIL_URL="smtp://noreply@pmdata.com.au:!PmD8122015*@smtp.pmdata.com.au:5525/";
	Accounts.emailTemplates.from = 'noreply@pmdata.com.au';
	//process.env.MAIL_URL="smtp://vikas@bizarmobile.com.au:slartibartfast@smtp.gmail.com:465/";
	//
	// Setup OAuth login service configuration (read from Meteor.settings)
	//
	// Your settings file should look like this:
	//
	// {
	//     "oauth": {
	//         "google": {
	//             "clientId": "yourClientId",
	//             "secret": "yourSecret"
	//         },
	//         "github": {
	//             "clientId": "yourClientId",
	//             "secret": "yourSecret"
	//         }
	//     }
	// }
	//
    if (Locations.find().count() === 0) {
        console.log("Importing private/products.json to db")

        var data = JSON.parse(Assets.getText("locations.json"));

        data.forEach(function (item, index, array) {
            Locations.insert(item);
        })
    }
	// Image upload
	console.log(process.env.FOO);
	UploadServer.init({
	    // tmpDir:  process.env.PWD + '/.uploads/tmp',
	    // uploadDir: process.env.PWD + '/.uploads/',
	    tmpDir: (process.env.FOO == 'development') ? process.env.IMAGES_DEV_PATH + '/tmp' : process.env.IMAGES_PATH + '/tmp',
	    uploadDir: (process.env.FOO == 'development') ? process.env.IMAGES_DEV_PATH + '/' : process.env.IMAGES_PATH + '/',
	    checkCreateDirectories: false,
	    overwrite: true,
	    getDirectory: function(fileInfo, formData) {
		console.log('getDirectory', formData, fileInfo);
	      if (formData && formData.directoryName != null) {
	        return formData.directoryName;
	      }
	      return "";
	    },
	    getFileName: function(fileInfo, formData) {
	      if (formData && formData.prefix != null) {
	        return formData.prefix + '_' + fileInfo.name;
	      }
	      return fileInfo.name;
	    },
	    finished: function(fileInfo, formData) {
	      console.log('formData', formData, fileInfo);
	      if (formData && formData._id != null) {
	      	if (formData.directoryName == 'images')
	        	Listing.upsert({_id: formData._id}, { $push: { images: fileInfo }});
	        else
	        	Listing.upsert({_id: formData._id}, { $push: { logo: fileInfo }});
	      }
	    }
	});

	if(Accounts && Accounts.loginServiceConfiguration && Meteor.settings && Meteor.settings.oauth && _.isObject(Meteor.settings.oauth)) {
		// google
		if(Meteor.settings.oauth.google && _.isObject(Meteor.settings.oauth.google)) {
			// remove old configuration
			Accounts.loginServiceConfiguration.remove({
				service: "google"
			});

			var settingsObject = Meteor.settings.oauth.google;
			settingsObject.service = "google";

			// add new configuration
			Accounts.loginServiceConfiguration.insert(settingsObject);
		}
		// github
		if(Meteor.settings.oauth.github && _.isObject(Meteor.settings.oauth.github)) {
			// remove old configuration
			Accounts.loginServiceConfiguration.remove({
				service: "github"
			});

			var settingsObject = Meteor.settings.oauth.github;
			settingsObject.service = "github";

			// add new configuration
			Accounts.loginServiceConfiguration.insert(settingsObject);
		}
		// linkedin
		if(Meteor.settings.oauth.linkedin && _.isObject(Meteor.settings.oauth.linkedin)) {
			// remove old configuration
			Accounts.loginServiceConfiguration.remove({
				service: "linkedin"
			});

			var settingsObject = Meteor.settings.oauth.linkedin;
			settingsObject.service = "linkedin";

			// add new configuration
			Accounts.loginServiceConfiguration.insert(settingsObject);
		}
		// facebook
		if(Meteor.settings.oauth.facebook && _.isObject(Meteor.settings.oauth.facebook)) {
			// remove old configuration
			Accounts.loginServiceConfiguration.remove({
				service: "facebook"
			});

			var settingsObject = Meteor.settings.oauth.facebook;
			settingsObject.service = "facebook";

			// add new configuration
			Accounts.loginServiceConfiguration.insert(settingsObject);
		}
		// twitter
		if(Meteor.settings.oauth.twitter && _.isObject(Meteor.settings.oauth.twitter)) {
			// remove old configuration
			Accounts.loginServiceConfiguration.remove({
				service: "twitter"
			});

			var settingsObject = Meteor.settings.oauth.twitter;
			settingsObject.service = "twitter";

			// add new configuration
			Accounts.loginServiceConfiguration.insert(settingsObject);
		}
		// meteor
		if(Meteor.settings.oauth.meteor && _.isObject(Meteor.settings.oauth.meteor)) {
			// remove old configuration
			Accounts.loginServiceConfiguration.remove({
				service: "meteor-developer"
			});

			var settingsObject = Meteor.settings.oauth.meteor;
			settingsObject.service = "meteor-developer";

			// add new configuration
			Accounts.loginServiceConfiguration.insert(settingsObject);
		}
	}


});

Meteor.methods({
	"createUserAccount": function(options) {
		if(!Users.isAdmin(Meteor.userId())) {
			throw new Meteor.Error(403, "Access denied.");
		}

		var userOptions = {};
		if(options.username) userOptions.username = options.username;
		if(options.email) userOptions.email = options.email;
		if(options.password) userOptions.password = options.password;
		if(options.profile) userOptions.profile = options.profile;
		if(options.profile && options.profile.email) userOptions.email = options.profile.email;
		if(options.roles) userOptions.roles = options.roles;
		console.log(userOptions);
		Accounts.createUser(userOptions);
	},
	"updateUserAccount": function(userId, options) {
		// only admin or users own profile
		if(!(Users.isAdmin(Meteor.userId()) || userId == Meteor.userId())) {
			throw new Meteor.Error(403, "Access denied.");
		}

		// non-admin user can change only profile
		if(!Users.isAdmin(Meteor.userId())) {
			var keys = Object.keys(options);
			if(keys.length !== 1 || !options.profile) {
				throw new Meteor.Error(403, "Access denied.");
			}
		}

		var userOptions = {};
		if(options.username) userOptions.username = options.username;
		if(options.email) userOptions.email = options.email;
		if(options.password) userOptions.password = options.password;
		if(options.profile) userOptions.profile = options.profile;

		if(options.profile && options.profile.email) userOptions.email = options.profile.email;
		if(options.roles) userOptions.roles = options.roles;

		if(userOptions.email) {
			var email = userOptions.email;
			delete userOptions.email;
			userOptions.emails = [{ address: email }];
		}

		var password = "";
		if(userOptions.password) {
			password = userOptions.password;
			delete userOptions.password;
		}

		if(userOptions) {
			Users.update(userId, { $set: userOptions });
		}

		if(password) {
			Accounts.setPassword(userId, password);
		}
	},
	"deleteUserAccount": function (userId) {
		if(!(Users.isAdmin(Meteor.userId()) || userId == Meteor.userId())) {
			throw new Meteor.Error(403, "Access denied.");
		}
		Users.remove({ _id: userId});
	},

	"sendMail": function(options) {
		console.log(options);
		this.unblock();
		console.log('unblock');
		options.from = 'noreply@pmdata.com.au';
		Email.send(options, function(err, res) {
		  console.log(err, res);
		});
	},

	'deleteFile': function(_id, name) {
	    //check(name, String);

	    var upload = Uploads.findOne({name: name});
	    if (upload == null) {
		    Listing.update({_id: _id}, {$pull: {images: {name: name}}});
	      	throw new Meteor.Error(404, 'Upload not found'); // maybe some other code
	    }
	    console.log(upload);
	    Listing.update({_id: _id}, {$pull: {images: {name: name}}});
	    UploadServer.delete(upload.path);
	    Uploads.remove(upload._id);
	},
	'deleteLogo': function(_id, name) {
	    //check(name, String);

	    var upload = Uploads.findOne({name: name});
	    if (upload == null) {
		    Listing.update({_id: _id}, {$pull: {logo: {name: name}}});
	      	throw new Meteor.Error(404, 'Upload not found'); // maybe some other code
	    }
	    console.log(upload);
	    Listing.update({_id: _id}, {$pull: {logo: {name: name}}});
	    UploadServer.delete(upload.path);
	    Uploads.remove(upload._id);
	},

	listingUpsert: function (_id, doc) {
		Listing.upsert({_id: _id}, doc);
	}
});

Accounts.onCreateUser(function (options, user) {
	user.roles = options.roles ? options.roles : ["user"];

	if(options.profile) {
		user.profile = options.profile;
	}


	return user;
});

Accounts.validateLoginAttempt(function(info) {

	// reject users with role "blocked"
	if(info.user && Users.isInRole(info.user._id, "blocked")) {
		throw new Meteor.Error(403, "Your account is blocked.");
	}

	return true;
});


Users.before.insert(function(userId, doc) {
	if(doc.emails && doc.emails[0] && doc.emails[0].address) {
		doc.profile = doc.profile || {};
		doc.profile.email = doc.emails[0].address;
	} else {
		// oauth
		if(doc.services) {
			// google e-mail
			if(doc.services.google && doc.services.google.email) {
				doc.profile = doc.profile || {};
				doc.profile.email = doc.services.google.email;
			} else {
				// github e-mail
				if(doc.services.github && doc.services.github.accessToken) {
					var github = new GitHub({
						version: "3.0.0",
						timeout: 5000
					});

					github.authenticate({
						type: "oauth",
						token: doc.services.github.accessToken
					});

					try {
						var result = github.user.getEmails({});
						var email = _.findWhere(result, { primary: true });
						if(!email && result.length && _.isString(result[0])) {
							email = { email: result[0] };
						}

						if(email) {
							doc.profile = doc.profile || {};
							doc.profile.email = email.email;
						}
					} catch(e) {
						console.log(e);
					}
				} else {
					// linkedin email
					if(doc.services.linkedin && doc.services.linkedin.emailAddress) {
						doc.profile = doc.profile || {};
						doc.profile.name = doc.services.linkedin.firstName + " " + doc.services.linkedin.lastName;
						doc.profile.email = doc.services.linkedin.emailAddress;
					} else {
						if(doc.services.facebook && doc.services.facebook.email) {
							doc.profile = doc.profile || {};
							doc.profile.email = doc.services.facebook.email;
						} else {
							if(doc.services.twitter && doc.services.twitter.email) {
								doc.profile = doc.profile || {};
								doc.profile.email = doc.services.twitter.email;
							} else {
								if(doc.services["meteor-developer"] && doc.services["meteor-developer"].emails && doc.services["meteor-developer"].emails.length) {
									doc.profile = doc.profile || {};
									doc.profile.email = doc.services["meteor-developer"].emails[0].address;
								}
							}
						}
					}
				}
			}
		}
	}
});

Users.before.update(function(userId, doc, fieldNames, modifier, options) {
	if(modifier.$set && modifier.$set.emails && modifier.$set.emails.length && modifier.$set.emails[0].address) {
		modifier.$set.profile.email = modifier.$set.emails[0].address;
	}
});

Accounts.onLogin(function (info) {

});

Accounts.urls.resetPassword = function (token) {
	return Meteor.absoluteUrl('reset_password/' + token);
};
