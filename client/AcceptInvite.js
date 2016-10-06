
Template.AcceptInvite.onCreated(function () {
    Template.instance().token = FlowRouter.getParam('token');
    var self = this;
    //self.subscribe('invites-status', Template.instance().token);
    self.subscribe('users', Meteor.userId());
    self.subscribe('invites2', FlowRouter.getParam('token'), Meteor.userId());
});

Template.AcceptInvite.helpers({

});

Template.AcceptInvite.events({
    'submit form': function(event, tmpl) {
        event.preventDefault();
        var email = event.target.email.value,
            password = event.target.password.value,
            profile = {
                firstName: event.target.firstName.value,
                lastName: event.target.lastName.value,
                gender: tmpl.find('#gender :selected').text
            };
        var usersCount;
        Meteor.call('users.count', function (error, count) {
            usersCount = count;
        });
        //console.log(usersCount);
        // if((invites2.findOne() || usersCount == undefined) && password.length >= 6 )
        //      Accounts.createUser({
        //          email: event.target.email.value,
        //          password: event.target.password.value,
        //          profile: {
        //              firstName: event.target.firstName.value,
        //              lastName: event.target.lastName.value,
        //              gender: tmpl.find('#gender :selected').text
        //          }
        //      }, function (err) {
        //          if(err)
        //              Toast.error(err.reason);
        //
        //             //FlowRouter.go('/');
        //      });
        // else
        //     Toast.error('Password must be at least 6 characters long')


    }
});