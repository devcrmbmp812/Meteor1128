
Template.HomePublicSearchResults.rendered = function() {
	console.log(Router.current().params.query);
	var query = Router.current().params.query;
	Session.set("urlQuery", query);
	Session.set("consultant_type", query.consultant_type);
	Session.set("contractor_type", query.consultant_type);
	Session.set("supplier_type", query.consultant_type);
	Session.set("project_value", query.project_value);
	Session.set("industry", query.industry);
	Session.set("industry_sub_sector", query.industry_sub_sector);
	Session.set("project_team_location", query.project_team_location);
	Session.set("type", query.type);
	Session.set("regions", query.region);
	Session.set("location", query.location);
	var h = $("#side-menu").parent.height();
	$("#side-menu").height(h + 'px');
};

Template.HomePublicSearchResults.events({
	"click #refine_search": function (e, t) {
		e.preventDefault();
		Session.set("consultant_type", $("#consultant_type option:selected").val());
		Session.set("contractor_type", $("#contractor_type option:selected").val());
		Session.set("supplier_type", $("#supplier_type option:selected").val());
		Session.set("project_value",  $('#project_value option:selected').val());
		//Session.set("industry",  $("#industry").val());
		Session.set("industry_sub_sector",  $('#industry_sub_sector option:selected').val());
		Session.set("regions",  $("#regions option:selected").val());
		console.log(Session.get("consultant_type"), $("#regions option:selected").val());
		var listings = HomePublicSearchListingsViewItems(this.admin_listings);
		console.log(listings);
		return listings;
	}
});

Template.HomePublicSearchResults.helpers({

});

Template.HomePublicSearchResultsSideMenu.helpers({
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
		return arr;
	},
	isConsultant: function () {
		return Session.get("type") == 'consultant';
	},
	isContractor: function () {
		return this.params.query.type == 'contractor';
	},
	isSupplier: function () {
		return this.params.query.type == 'supplier';
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
		//Session.set("regions", sortedArray[0]);
		return sortedArray;
	},
	selected: function(key, value) {
		var val = Session.get(key);
	  return val == value ? true : false;
	}
});

Template.HomePublicSearchResultsListings.helpers({
	"isEmpty": function() {
		return HomePublicSearchListingsViewItems(this.admin_listings).length == 0;
	},
		"tableItems": function() {
		return HomePublicSearchListingsViewItems(this.admin_listings);
	}
});
var HomePublicSearchListingsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}
	var type = Session.get("type");
	var consultant_type = Session.get("consultant_type");
	var contractor_type = Session.get("contractor_type");
	var supplier_type = Session.get("supplier_type");
	var project_value = Session.get("project_value");
	var industry = Session.get("industry");
	var regions = Session.get("regions");
	var industry_sub_sector = Session.get("industry_sub_sector");
	var project_team_location = Session.get("project_team_location");
	var sortBy = Session.get("AdminUsersViewSortBy");
	var sortAscending = Session.get("AdminUsersViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;
	var raw = cursor.fetch();	// filter
	console.log('listings', raw);
	var filtered = raw;

	if (type == "consultant") {
		filtered = _.filter(raw, function (item) {
			return _.contains(item.consultant_type, consultant_type);
		});
	} else if (type == "contractor") {
		filtered = _.filter(raw, function (item) {
			return _.contains(item.contractor_type, contractor_type);
		});

	} else if (type == "supplier") {
		filtered = _.filter(raw, function (item) {
			return _.contains(item.supplier_type, supplier_type);
		});

	}
	//filtered = _.filter(raw, {'consultant_type': consultant_type});
	//, type: this.params.query.type
	//, 'project_value': project_value, 'industry': industry, 'industry_sub_sector': industry_sub_sector'project_team_location': project_team_location
	console.log('filtered', filtered);
	var locationFiltered = _.filter(filtered, function (item) {
		return _.contains(item.areas_serviced, Session.get("location"));
	})
	var preferance4 = [], preferance3 = [], preferance2 = [], preferance1 = [];
	_.each(locationFiltered, function (item) {
		var isLocationMatch = _.contains(item.regions, Session.get("regions"));
		//var isRegionMatch = _.contains(item.regions, Session.get("regions"));
		var isProjectTeamLocationMatch = _.contains(item.project_team_location, Session.get("project_team_location"));
		var isSectorMatch = _.contains(item.industry, Session.get("industry"));
		var isProjectValueMatch = ((project_value >= parseInt(item.minimum_project_value)) && (project_value <= parseInt(item.maximum_project_value)));
		if (isLocationMatch && isProjectTeamLocationMatch && isSectorMatch && isProjectValueMatch) {
			preferance4.push(item);
		}
		if (isLocationMatch && isProjectTeamLocationMatch && isSectorMatch) {
			if (!(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance3.push(item);
		}

		if (isLocationMatch && isProjectTeamLocationMatch && isProjectValueMatch) {
			if (!(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance3.push(item);
		}
		if (isLocationMatch && isSectorMatch && isProjectValueMatch) {
			if (!(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance3.push(item);
		}
		if (isProjectTeamLocationMatch && isSectorMatch && isProjectValueMatch) {
			if (!(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance3.push(item);
		}

		if (isProjectTeamLocationMatch && isSectorMatch) {
			if (!(_.contains(preferance2, item)) && !(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance2.push(item);
		}

		if (isProjectTeamLocationMatch && isProjectValueMatch) {
			if (!(_.contains(preferance2, item)) && !(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance2.push(item);
		}
		if (isProjectTeamLocationMatch && isLocationMatch) {
			if (!(_.contains(preferance2, item)) && !(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance2.push(item);
		}
		if (isLocationMatch && isSectorMatch) {
			if (!(_.contains(preferance2, item)) && !(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance2.push(item);
		}
		if (isProjectValueMatch && isSectorMatch) {
			if (!(_.contains(preferance2, item)) && !(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance2.push(item);
		}
		if (isLocationMatch && isProjectValueMatch) {
			if (!(_.contains(preferance2, item)) && !(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance2.push(item);
		}

		if (isLocationMatch) {
			if (!(_.contains(preferance1, item)) && !(_.contains(preferance2, item)) && !(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance1.push(item);

		}
		if (isProjectTeamLocationMatch) {
			if (!(_.contains(preferance1, item)) && !(_.contains(preferance2, item)) && !(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance1.push(item);

		}
		if (isSectorMatch) {
			if (!(_.contains(preferance1, item)) && !(_.contains(preferance2, item)) && !(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance1.push(item);

		}
		if (isProjectValueMatch) {
			if (!(_.contains(preferance1, item)) && !(_.contains(preferance2, item)) && !(_.contains(preferance3, item)) && !(_.contains(preferance4, item)))
				preferance1.push(item);

		}
	});
	//console.log('preferance', preferance);
	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}
	var finalArray = [];
	var pref4 = shuffle(preferance4);
	var pref3 = shuffle(preferance3);
	var pref2 = shuffle(preferance2);
	var pref1 = shuffle(preferance1);
	_.each(pref4 , function (item) {
			finalArray.push(item);
	});
	_.each(pref3 , function (item) {
		if (!(_.contains(finalArray, item))) {
			finalArray.push(item);
		}
	});
	_.each(pref2 , function (item) {
		if (!(_.contains(finalArray, item))) {
			finalArray.push(item);
		}
	});
	_.each(pref1 , function (item) {
		if (!(_.contains(finalArray, item))) {
			finalArray.push(item);
		}
	})
	return finalArray;
};

Template.HomePublicSearchListingItem.events({
	"click #more-button": function(e, t) {
		e.preventDefault();
		Router.go("home_public_listing_detail", {listingId: this._id});
		return false;
	},

	"click #more": function(e, t) {
		e.preventDefault();
		ga("send", "event", "Listing", "View Listing", this.company_name, 30);
		Router.go("home_public_listing_detail", {listingId: this._id});
		return false;
	}
});

Template.HomePublicSearchListingItem.helpers({
	logoImage: function (img) {
		console.log(img);
		return (!img || img.length == 0) ? '/images/logo-placeholder.png' : Meteor.settings.public.site_host + "/" + img[0].path;
	},
	isConsultant: function () {
		return Session.get("type") == 'consultant';
	},
	isLocationMatch: function (areas) {
		console.log(areas, Session.get("regions"));
		return _.contains(areas, Session.get("regions"));
	},
	isSubSectorMatch: function (areas) {
		return _.contains(areas, Session.get("industry_sub_sector"));
	},
	isSectorMatch: function (areas) {
		return _.contains(areas, Session.get("industry"));
	},
	isProjectTeamLocationMatch: function (areas) {
		return _.contains(areas, Session.get("project_team_location"));
	},
	isProjectValueMatch: function(minProjectValue, maxProjectValue) {
		var project_value = parseInt(Session.get("project_value"));
		return ((project_value >= parseInt(minProjectValue)) && (project_value <= parseInt(maxProjectValue)));
	}
})

