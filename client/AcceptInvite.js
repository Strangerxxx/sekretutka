
Template.AcceptInvite.onCreated(function () {
    Template.instance().token = FlowRouter.getParam('token');
    var self = this;
    self.subscribe('users', Meteor.userId());
    self.subscribe('invites2', FlowRouter.getParam('token'), Meteor.userId());
});

Template.AcceptInvite.onRendered(function () {
    if(invites2.findOne())
        Meteor.call('invites.set-visited', Template.instance().token);
});

Template.AcceptInvite.helpers({
    claimed: () => {
        var invite = invites2.findOne();
        if(invite.status == 'invited' || invite.status == 'visited')
            return false;
        return true;
    }
});

Template.AcceptInvite.events({
    'submit form': function(event) {
        event.preventDefault();
        console.log(event.target);
        var email = event.target.email.value,
            password = event.target.password.value,
            profile = event.target.profile;

        Meteor.call('users.count', function (error, count) {
            if((invites2.findOne() || count == 0) && password.length >= 6 )
                Accounts.createUser({
                    email: email,
                    password: password,
                    profile: profile,
                }, function (err) {
                    if(err)
                        Toast.error(err.reason);
                    else{
                        Meteor.call('invites.set-claimed', invites2.findOne()._id);
                        FlowRouter.go('/');
                    }

                });
            else if(password.length < 6)
                Toast.error('Password must be at least 6 characters long');
            else if(!invites2.findOne())
                Toast.error('Invite is not valid');
            else
                Toast.error('Error');
        });
    }
});