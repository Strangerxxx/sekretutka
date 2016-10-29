
Template.AcceptInvite.onCreated(function () {
    Template.instance().token = FlowRouter.getParam('token');
    var self = this;
    self.subscribe('users', Meteor.userId());
    self.subscribe('invites', Template.instance().token, Meteor.userId());
});


Template.AcceptInvite.helpers({
    claimed: () => {
        var invite = invites.findOne();
        if(invite) {
            Meteor.call('invites.set-visited', Template.instance().token);
            return !(invite.status == 'invited' || invite.status == 'visited');
        } else return true;
    },
    token: () => Template.instance().token,
    newUserSchema: () => Schema.newUser
});

AutoForm.hooks({
    register: {
        onSuccess: (formType, result) => {
            Accounts.loginWithToken(result);
            FlowRouter.redirect('/');
        }
    }
});
