
Template.AcceptInvite.onCreated(function () {
    Template.instance().token = FlowRouter.getParam('token');
    var self = this;
    self.subscribe('users', Meteor.userId());
    self.subscribe('invites', FlowRouter.getParam('token'), Meteor.userId());
});

Template.AcceptInvite.onRendered(function () {
    if(invites.findOne())
        Meteor.call('invites.set-visited', Template.instance().token);
});

Template.AcceptInvite.helpers({
    claimed: () => {
        var invite = invites.findOne();
        return !(invite.status == 'invited' || invite.status == 'visited');
    },
    token: () => FlowRouter.getParam('token'),
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
