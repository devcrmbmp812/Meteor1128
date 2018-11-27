Template.HomePublicSearch.rendered = function() {

};

Template.HomePublicSearch.helpers({

});

Template.HomePublicSearchJumbotron.rendered = function() {

};

Template.HomePublicSearchJumbotron.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("", {});
	}

});

Template.HomePublicSearchJumbotron.helpers({

});

Template.HomePublicSearch.rendered = function() {
}

Template.HomePublicHomeSearch.helpers({

});

Template.HomePublicSearch.events({
		'click .home-btn': function(e) {
			e.preventDefault();
			console.log(e.currentTarget);
			$(".home-btn").removeClass('active');
			$(e.currentTarget).addClass('active');
		},
		"submit form": function(e, t) {
			e.preventDefault();
			console.log('hello', $("#consultant_type").val());
			var project_location = $("#locations option:selected").val();
			var regions = $("#regions option:selected").val();
			var consultant_type;
			if ($("#consultant_type option:selected").val()) {
				consultant_type = $("#consultant_type option:selected").val();
			} else if ($("#contractor_type option:selected").val()) {
				consultant_type = $("#contractor_type option:selected").val();
			} else if ($("#supplier_type option:selected").val()) {
				consultant_type = $("#supplier_type option:selected").val();
			}
			var queryString = 'consultant_type=' +  consultant_type;
			queryString += '&project_value=' +  $("#project_value").val();
			queryString += '&industry=' +  $("#industry").val();
			queryString += '&industry_sub_sector=' +  $("#industry_sub_sector").val();
			queryString += '&project_team_location=' +  $("#project_team_location").val();
			queryString += '&type=' + this.params.type;
			queryString += '&location=' + project_location;
			queryString += '&region=' + regions;
			//queryString += '&commencement_date=' +  $("#commencement_date").val();
			if (project_location && $("#project_value").val() != '')
				Router.go("home_public_search_results", {}, {query: queryString});
			else
				showModalMessageWithTitle("", "Please choose a project location, region and project value.")
		},
		'change #locations': function (e, t) {
			var loc = $("#locations option:selected").val();
			console.log(loc);
			Session.set("state", loc);
		}
});
Template.HomePublicSearchLocation.helpers({
	getContractors: function() {
		var raw = ContractorType.find({}, {sort: {name: 1}}).fetch();
		var filtered = [];
		var searchString = 'head';
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
		var arr = _.union(filtered, raw);
		console.log('arr', arr);
		return arr;
	},
	isConsultant: function () {
		return this.params.type == 'consultant';
	},
	isContractor: function () {
		return this.params.type == 'contractor';
	},
	isSupplier: function () {
		return this.params.type == 'supplier';
	},
	sortedRegions: function () {

		var sortedList = LocationsList(this.locations);
		console.log(sortedList);
		return sortedList;
	},
	sortedRegionsByState: function () {
		console.log(this.locations);
		var sortedRegions = RegionsList(this.locations, Session.get('state'));
		console.log(sortedRegions);
		return sortedRegions;
	}
})