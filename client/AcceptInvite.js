
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

// Template.AcceptInvite.events({
//     'submit form': function(event) {
//         event.preventDefault();
//         console.log(event.target);
//         var email = event.target.email.value,
//             password = event.target.password.value,
//             profile = event.target.profile;
//
//         Meteor.call('users.count', function (error, count) {
//             if((invites.findOne() || count == 0) && password.length >= 6 )
//                 Accounts.createUser({
//                     email: email,
//                     password: password,
//                     profile: profile,
//                 }, function (err) {
//                     if(err)
//                         Toast.error(err.reason);
//                     else{
//                         Meteor.call('invites.set-claimed', invites.findOne()._id);
//                         FlowRouter.go('/');
//                     }
//
//                 });
//             else if(password.length < 6)
//                 Toast.error('Password must be at least 6 characters long');
//             else if(!invites.findOne())
//                 Toast.error('Invite is not valid');
//             else
//                 Toast.error('Error');
//         });
//     }
// });