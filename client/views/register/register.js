var pageSession = new ReactiveDict();
pageSession.set("errorMessage", "");
Template.Register.rendered = function () {
    $("input[autofocus]").focus();
};
Template.Register.created = function () {
    pageSession.set("errorMessage", "");
};
Template.Register.events({
    'submit #register_form': function (e, t) {
        e.preventDefault();
        var submit_button = $(t.find(":submit"));
        var register_name = t.find('#register_name').value.trim();
        var register_email = (t.find('#register_email').value.trim()).toLowerCase();
        var register_password = t.find('#register_password').value;
        var confirm_register_password = t.find('#confirm_register_password').value;
        // check name
        if (register_name == "") {
            pageSession.set("errorMessage", "Please enter your name.");
            t.find('#register_name').focus();
            return false;
        }
        // check email
        if (!isValidEmail(register_email)) {
            pageSession.set("errorMessage", "Please enter valid e-mail address.");
            t.find('#register_email').focus();
            return false;
        }
        // check password
        var min_password_len = 6;
        if (!isValidPassword(register_password, min_password_len)) {
            pageSession.set("errorMessage", "Your password must be at least " + min_password_len + " characters long.");
            t.find('#register_password').focus();
            return false;
        }
        if (register_password != confirm_register_password) {
            pageSession.set("errorMessage", "Your password did not match.");
            t.find('#confirm_register_password').focus();
            return false;
        }
        submit_button.button("loading");
        Accounts.createUser({
            email: register_email,
            password: register_password,
            profile: {
                name: register_name
            }
        }, function (err) {
            submit_button.button("reset");
            if (err) {
                pageSession.set("errorMessage", err.message);
            } else {
                // send email
                var message = 'Hi ' + register_name + ",\n\n";
                message += "Welcome to the PM Data community, you are now able to add business listings, manage your favourites and search for other members as you need.\n\n";
                message += "Kind regards,\n\nThe PM Data Team\n";
                var options = {
                    from: 'noreply@pmdata.com.au',
                    to: register_email,
                    bcc: 'service@pmdata.com.au',
                    subject: 'Welcome to PM Data',
                    text: message
                };
                Meteor.call('sendMail', options, function(err, res) {
                  console.log(err, res);
                });
                pageSession.set("errorMessage", "");
            }
        });
        return false;
    }
});
Template.Register.helpers({
    errorMessage: function () {
        return pageSession.get("errorMessage");
    }
});
Template.RegisterRegisterJumbotron.rendered = function () {};
Template.RegisterRegisterJumbotron.events({
    "click #jumbotron-button": function (e, t) {
        e.preventDefault();
        Router.go("", {});
    }
});
Template.RegisterRegisterJumbotron.helpers({});