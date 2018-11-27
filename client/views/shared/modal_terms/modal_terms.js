Template.modalTerms.helpers({
	termsOdUse: function () {
		var terms =  Cms.findOne({name: 'terms_of_use'});
		return terms.content;
	}
})