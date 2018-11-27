Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading",
	title: 'PM Data - Home',
	trackPageView: true,
	waitOn: function () {
		return Meteor.subscribe("public_cms");
	}
});

var publicRoutes = [
	"login",
	"register",
	"forgot_password",
	"reset_password",
	"free_listings"
];

var privateRoutes = [
	"home_private",
	"admin",
	"admin.users",
	"admin.users.details",
	"admin.users.insert",
	"admin.users.edit",
	"admin.consultant_types",
	"admin.consultant_types.insert",
	"admin.consultant_types.edit",
	"admin.project_value",
	"admin.project_value.insert",
	"admin.project_value.edit",
	"admin.industry",
	"admin.industry.insert",
	"admin.industry.edit",
	"admin.industry_sub_sector",
	"admin.industry_sub_sector.insert",
	"admin.industry_sub_sector.edit",
	"admin.project_team_location",
	"admin.project_team_location.insert",
	"admin.project_team_location.edit",
	"admin.cms",
	"admin.cms.insert",
	"admin.cms.edit",
	"admin.listings",
	"admin.listings.insert",
	"admin.listings.edit",
	"admin.locations",
	"admin.locations.edit",
	"admin.locations.insert",
	"user_settings",
	"user_settings.profile",
	"user_settings.change_pass",
	"contact_listing_provider",
	"user.home",
	"user.search_business",
	"user.listings",
	"user.listings.edit",
	"user.listings.insert",
	"user.favorites",
	"logout"
];

var freeRoutes = [
	"home_public",
	"home_public_search",
	"home_public_search_results",
	"home_public_listing_detail",
	"privacy",
	"about_us",
	"contact_us",
	"pages"
];

var roleMap = [
	{ route: "admin",	roles: ["admin"] },
	{ route: "admin.users",	roles: ["admin"] },
	{ route: "admin.users.details",	roles: ["admin"] },
	{ route: "admin.users.insert",	roles: ["admin"] },
	{ route: "admin.users.edit",	roles: ["admin"] },
	{ route: "admin.consultant_types",	roles: ["admin"] },
	{ route: "admin.consultant_types.insert",	roles: ["admin"] },
	{ route: "admin.consultant_types.edit",	roles: ["admin"] },
	{ route: "admin.contractor_types",	roles: ["admin"] },
	{ route: "admin.contractor_types.insert",	roles: ["admin"] },
	{ route: "admin.contractor_types.edit",	roles: ["admin"] },
	{ route: "admin.supplier_types",	roles: ["admin"] },
	{ route: "admin.supplier_types.insert",	roles: ["admin"] },
	{ route: "admin.supplier_types.edit",	roles: ["admin"] },
	{ route: "admin.project_value",	roles: ["admin"] },
	{ route: "admin.project_value.insert",	roles: ["admin"] },
	{ route: "admin.project_value.edit",	roles: ["admin"] },
	{ route: "admin.industry",	roles: ["admin"] },
	{ route: "admin.industry.insert",	roles: ["admin"] },
	{ route: "admin.industry.edit",	roles: ["admin"] },
	{ route: "admin.locations",	roles: ["admin"] },
	{ route: "admin.locations.insert",	roles: ["admin"] },
	{ route: "admin.locations.edit",	roles: ["admin"] },
	{ route: "admin.industry_sub_sector",	roles: ["admin"] },
	{ route: "admin.industry_sub_sector.insert",	roles: ["admin"] },
	{ route: "admin.industry_sub_sector.edit",	roles: ["admin"] },
	{ route: "admin.project_team_location",	roles: ["admin"] },
	{ route: "admin.project_team_location.insert",	roles: ["admin"] },
	{ route: "admin.project_team_location.edit",	roles: ["admin"] },
	{ route: "admin.cms",	roles: ["admin"] },
	{ route: "admin.cms.insert",	roles: ["admin"] },
	{ route: "admin.cms.edit",	roles: ["admin"] },
	{ route: "admin.listings",	roles: ["admin"] },
	{ route: "admin.listings.insert",	roles: ["admin"] },
	{ route: "admin.listings.edit",	roles: ["admin"] },
	{ route: "user_settings",	roles: ["user","admin"] },
	{ route: "user_settings.profile",	roles: ["user","admin"] },
	{ route: "user_settings.change_pass",	roles: ["user","admin"] },
	{ route: "contact_listing_provider", roles: ["user"]},
	{ route: "user.home",	roles: ["user"] },
	{ route: "user.favorites",	roles: ["user"] },
	{ route: "user.search_business", roles: ["user"] },
	{ route: "user.listings", roles: ["customer","user"]},
	{ route: "user.listings.edit", roles: ["customer","user"]},
	{ route: "user.listings.insert", roles: ["customer","user"]},

];

this.firstGrantedRoute = function(preferredRoute) {
	if(preferredRoute && routeGranted(preferredRoute)) return preferredRoute;

	var grantedRoute = "";

	_.every(privateRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(publicRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(freeRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	if(!grantedRoute) {
		// what to do?
		console.log("All routes are restricted for current user.");
	}

	return "";
}

// this function returns true if user is in role allowed to access given route
this.routeGranted = function(routeName) {
	if(!routeName) {
		// route without name - enable access (?)
		return true;
	}

	if(!roleMap || roleMap.length === 0) {
		// this app don't have role map - enable access
		return true;
	}

	var roleMapItem = _.find(roleMap, function(roleItem) { return roleItem.route == routeName; });
	if(!roleMapItem) {
		// page is not restricted
		return true;
	}

	if(!Meteor.user() || !Meteor.user().roles) {
		// user is not logged in
		return false;
	}

	// this page is restricted to some role(s), check if user is in one of allowedRoles
	var allowedRoles = roleMapItem.roles;
	var granted = _.intersection(allowedRoles, Meteor.user().roles);
	if(!granted || granted.length === 0) {
		return false;
	}

	return true;
};

Router.ensureLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}
	if(!Meteor.userId()) {
		// user is not logged in - redirect to public home
		//var redirectRoute = '/login?next=/contact_listing_provider/' + this.params.listingId;
		var redirectRoute = firstGrantedRoute("login");
		this.redirect(redirectRoute);
	} else {
		// user is logged in - check role
		if(!routeGranted(this.route.getName())) {
			// user is not in allowedRoles - redirect to first granted route
			var redirectRoute;
			if (_.contains(Meteor.user().roles, "admin"))
			    redirectRoute = firstGrantedRoute("admin.users");
			else
				redirectRoute = firstGrantedRoute("user.listings");
			console.log(redirectRoute);
			this.redirect(redirectRoute);
		} else {
			this.next();
		}
	}
};

Router.ensureNotLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}

	if(Meteor.userId()) {
		// var redirectRoute = firstGrantedRoute("home_private");
		// this.redirect(redirectRoute);
			var redirectRoute;
			if (_.contains(Meteor.user().roles, "admin"))
			    redirectRoute = firstGrantedRoute("admin.users");
			else
				redirectRoute = firstGrantedRoute("user.listings");
			console.log(redirectRoute);
			this.redirect(redirectRoute);

	}
	else {
		this.next();
	}
};

// called for pages in free zone - some of pages can be restricted
Router.ensureGranted = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}

	if(!routeGranted(this.route.getName())) {
		// user is not in allowedRoles - redirect to first granted route
		var redirectRoute = firstGrantedRoute("");
		this.redirect(redirectRoute);
	} else {
		this.next();
	}
};

Meteor.subscribe("current_user_data");

Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		$("body").addClass("wait");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});

Router.onBeforeAction(Router.ensureNotLogged, {only: publicRoutes});
Router.onBeforeAction(Router.ensureLogged, {only: privateRoutes});
Router.onBeforeAction(Router.ensureGranted, {only: freeRoutes}); // yes, route from free zone can be restricted to specific set of user roles
Appname = 'PM Data';
Router.map(function () {

	this.route("pages", {path: "/pages/:id", controller: "PagesController"});
	this.route("home_public", {path: "/", controller: "HomePublicController", title: Appname + ' - Home'});
	this.route("home_public_search", {path: "/search/:type", controller: "HomePublicSearchController", title: Appname + ' - Search'});
	this.route("home_public_search_results", {path: "/searchresults", controller: "HomePublicSearchResultsController", title: Appname + ' - Search Results'});
	this.route("home_public_listing_detail", {path: "/listing/:listingId", controller: "HomePublicListingDetailController", title: Appname + ' - Listing Detail'});
	this.route("free_listing", {path: "/list_your_business", controller: "FreeListingController", title: Appname + ' - List Your Business'});
	this.route("contact_listing_provider", {path: "/contact_listing_provider/:listingId", controller: "ContactListingProviderController", title: Appname + ' - Contact Provider'});
	this.route("login", {path: "/login", controller: "LoginController", title: Appname + ' - Login'});
	this.route("register", {path: "/register", controller: "RegisterController", title: Appname + ' - Register'});
	this.route("forgot_password", {path: "/forgot_password", controller: "ForgotPasswordController", title: Appname + ' - Forgot Password'});
	this.route("reset_password", {path: "/reset_password/:resetPasswordToken", controller: "ResetPasswordController", title: Appname + ' - Password Reset'});
	this.route("about_us", {path: "/about_us", controller: "AboutUsController", title: Appname + ' - About Us'});
	this.route("contact_us", {path: "/contact_us", controller: "ContactUsController", title: Appname + ' - Contact Us'});
	this.route("home_private", {path: "/home_private", controller: "HomePrivateController", title: Appname + ' - Dashboard'});
	this.route("admin", {path: "/admin", controller: "AdminController", title: Appname + ' - Administration'});
	this.route("admin.users", {path: "/admin/users", controller: "AdminUsersController", title: Appname + ' - Users'});
	this.route("admin.users.details", {path: "/admin/users/details/:userId", controller: "AdminUsersDetailsController", title: Appname + ' - User Details'});
	this.route("admin.users.insert", {path: "/admin/users/insert", controller: "AdminUsersInsertController", title: Appname + ' - New User'});
	this.route("admin.users.edit", {path: "/admin/users/edit/:userId", controller: "AdminUsersEditController", title: Appname + ' - Edit User'});
	this.route("admin.consultant_types", {path: "/admin/consultant_types", controller: "AdminConsultantTypesController", title: Appname + ' - Consultant Types'});
	this.route("admin.consultant_types.insert", {path: "/admin/consultant_types/insert", controller: "AdminConsultantTypesInsertController", title: Appname + ' - New Consultant'});
	this.route("admin.consultant_types.edit", {path: "/admin/consultant_types/edit/:ctId", controller: "AdminConsultantTypesEditController", title: Appname + ' - Edit Consultant'});
	this.route("admin.contractor_types", {path: "/admin/contractor_types", controller: "AdminContractorTypesController", title: Appname + ' - Contractor Types'});
	this.route("admin.contractor_types.insert", {path: "/admin/contractor_types/insert", controller: "AdminContractorTypesInsertController", title: Appname + ' - New Contractor'});
	this.route("admin.contractor_types.edit", {path: "/admin/contractor_types/edit/:ctId", controller: "AdminContractorTypesEditController", title: Appname + ' - Edit Contractor'});
	this.route("admin.supplier_types", {path: "/admin/supplier_types", controller: "AdminSupplierTypesController", title: Appname + ' - Supplier Types'});
	this.route("admin.supplier_types.insert", {path: "/admin/supplier_types/insert", controller: "AdminSupplierTypesInsertController", title: Appname + ' - New Supplier'});
	this.route("admin.supplier_types.edit", {path: "/admin/supplier_types/edit/:ctId", controller: "AdminSupplierTypesEditController", title: Appname + ' - Edit Supplier'});
	this.route("admin.project_value", {path: "/admin/project_value", controller: "AdminProjectValueController", title: Appname + ' - Project Values'});
	this.route("admin.project_value.insert", {path: "/admin/project_value/insert", controller: "AdminProjectValueInsertController", title: Appname + ' - New Project Value'});
	this.route("admin.project_value.edit", {path: "/admin/project_value/edit/:projectId", controller: "AdminProjectValueEditController", title: Appname + ' - Edit Project Value'});
	this.route("admin.industry", {path: "/admin/industry", controller: "AdminIndustryController", title: Appname + ' - Industry'});
	this.route("admin.industry.insert", {path: "/admin/industry/insert", controller: "AdminIndustryInsertController", title: Appname + ' - New Industry'});
	this.route("admin.industry.edit", {path: "/admin/industry/edit/:id", controller: "AdminIndustryEditController", title: Appname + ' - Edit Industry'});
	this.route("admin.locations", {path: "/admin/locations", controller: "AdminLocationsController", title: Appname + ' - Locations'});
	this.route("admin.locations.insert", {path: "/admin/locations/insert", controller: "AdminLocationsInsertController", title: Appname + ' - New Location'});
	this.route("admin.locations.edit", {path: "/admin/locations/edit/:id", controller: "AdminLocationsEditController", title: Appname + ' - Edit Location'});

	this.route("admin.industry_sub_sector", {path: "/admin/industry_sub_sector", controller: "AdminIndustrySubSectorController"});
	this.route("admin.industry_sub_sector.insert", {path: "/admin/industry_sub_sector/insert", controller: "AdminIndustrySubSectorInsertController"});
	this.route("admin.industry_sub_sector.edit", {path: "/admin/industry_sub_sector/edit/:id", controller: "AdminIndustrySubSectorEditController"});
	this.route("admin.project_team_location", {path: "/admin/project_team_location", controller: "AdminProjectTeamLocationController", title: Appname + ' - Team Locations'});
	this.route("admin.project_team_location.insert", {path: "/admin/project_team_location/insert", controller: "AdminProjectTeamLocationInsertController", title: Appname + ' - New Project Team Location'});
	this.route("admin.project_team_location.edit", {path: "/admin/project_team_location/edit/:id", controller: "AdminProjectTeamLocationEditController", title: Appname + ' - Edit Project Team Location'});
	this.route("admin.cms", {path: "/admin/cms", controller: "AdminCmsController", title: Appname + ' - CMS'});
	this.route("admin.cms.insert", {path: "/admin/cms/insert", controller: "AdminCmsInsertController", title: Appname + ' - New Page'});
	this.route("admin.cms.edit", {path: "/admin/cms/edit/:id", controller: "AdminCmsEditController", title: Appname + ' - Edit Page'});
	this.route("admin.listings", {path: "/admin/listings", controller: "AdminListingsController", title: Appname + ' - Listings'});
	this.route("admin.listings.insert", {path: "/admin/listings/insert/:id", controller: "AdminListingsInsertController", title: Appname + ' - New Listing'});
	this.route("admin.listings.edit", {path: "/admin/listings/edit/:id/:userId", controller: "AdminListingsEditController", title: Appname + ' - Edit Listing'});
	this.route("user_settings", {path: "/user_settings", controller: "UserSettingsController", title: Appname + ' - Settings'});
	this.route("user_settings.profile", {path: "/user_settings/profile", controller: "UserSettingsProfileController", title: Appname + ' - User Profile'});
	this.route("user_settings.change_pass", {path: "/user_settings/change_pass", controller: "UserSettingsChangePassController", title: Appname + ' - Change Password'});
	this.route("user.listings", {path: "/user/listings", controller: "UserListingsController", title: Appname + ' - Business Listing'});
	this.route("user.favorites", {path: "/user/favorites", controller: "UserFavoritesController", title: Appname + ' - Favorites'});
	this.route("user.search_business", {path: "/user/search_business", controller: "SearchBusinessListingsController", title: Appname + ' - Search'});
	this.route("user.listing_detail", {path: "/user/listing/:listingId", controller: "UserListingDetailController", title: Appname + ' - Listing Details'});

	this.route("user.listings.insert", {path: "/user/listings/insert/:id", controller: "UserInsertListingController", title: Appname + ' - New Listing'});
	this.route("user.home", {path: "/user", controller: "HomePrivateController"});
	this.route("user.listings.edit", {path: "/user/listings/edit/:id", controller: "UserListingsEditController", title: Appname + ' - Edit Listing'});
	this.route("logout", {path: "/logout", controller: "LogoutController"});
});
