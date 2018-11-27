Template.HomePrivate.rendered = function() {
	//Router.go('user.listings');
};

Template.HomePrivate.events({

});

Template.HomePrivate.helpers({

});

Template.HomePrivateSideMenu.rendered = function() {
	$(".menu-item-collapse .dropdown-toggle").each(function() {
		if($(this).find("li.active")) {
			$(this).removeClass("collapsed");
		}
		$(this).parent().find(".collapse").each(function() {
			if($(this).find("li.active").length) {
				$(this).addClass("in");
			}
		});
	});


};