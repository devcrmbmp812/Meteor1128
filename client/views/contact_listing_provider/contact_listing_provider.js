var pageSession = new ReactiveDict();

Template.ContactListingBackButton.events({
	"click #form-back-button": function(e, t) {
		e.preventDefault();
		var currentData = Template.currentData();
		console.log(currentData);
		Router.go("home_public_listing_detail", {listingId: currentData.params.listingId});
	}
});

Template.ContactListingProviderForm.rendered = function() {
	pageSession.set("sentEmail", "0");
};

Template.ContactListingProviderForm.events({
	"click #submit": function(e, t) {
		e.preventDefault();
		var cc = $("#email").val();
		var bcc = ($("#bcc-email").val() != '') ? ['service@pmdata.com.au', $("#bcc-email").val()] : 'service@pmdata.com.au';
		var to = this.admin_listings.company_email;
		var subject = $("#subject").val();
		var message = $("#message").val();
		message += '\nContacted By: ' + Meteor.user().emails[0].address;
		subject += " - " +  Meteor.user().profile.name;
		var options = {from: 'noreply@pmdata.com.au', to: to, cc: cc, bcc: bcc, subject: subject, text: message};
		console.log(options);
		console.log(Meteor.user().emails[0].address);
		ga("send", "event", "Enquiry", "Send Enquiry", this.admin_listings.company_name, 25);
		Meteor.call('sendMail', options);
		pageSession.set("sentEmail", "1");

	}
});

Template.ContactListingProviderForm.helpers({
	"notSentMail": function() {
		return pageSession.get("sentEmail") == "0";
	},
	createEmailBody: function () {
		var n = {value: parseInt(Session.get("project_value"))};
		console.log(n);
		var val = ProjectValue.findOne({value: parseInt(Session.get("project_value"))}) ;
		var message = "To the sales/development team,\n";
		message += "I am enquiring with regard to a project as detailed below.\n\n";
		message += "[Please provide any further information relating to your request]\n\n";
		message += Session.get("location") + '\n';
		message += Session.get("industry") + '\n';
		message += val.name + '\n';
		return message;
	}
});

Template.ContactListingProviderSideMenu.helpers({
	isConsultant: function () {
		return Session.get("type") == 'consultant';
	},
	isContractor: function () {
		return Session.get("type") == 'contractor';
	},
	isSupplier: function () {
		return Session.get("type") == 'supplier';
	},
	getIndustrySubSector: function () {
		var industryName = Session.get("industry");
		var industry = Industry.findOne({name: industryName});
		var industry_sub_sector = industry.industry_sub_sector ? industry.industry_sub_sector : [];
		var sortedArray = _.sortBy(industry_sub_sector, function (name) {return name;})
		console.log('industry_sub_sector', sortedArray);
		return sortedArray;
	},
	getRegionsForState: function (locations) {
		var regions = locations ? locations.regions : [];
		var sortedArray = _.sortBy(regions, function (name) {return name;})
		console.log('regions', sortedArray);
		return sortedArray;
	},
	selected: function(key, value) {
		var val = pageSession.get(key);
	  return val == value ? true : false;
	}
});
