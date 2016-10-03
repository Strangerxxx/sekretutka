
Template.AcceptInvite.onCreated(function () {
    Template.instance().token = FlowRouter.getParam('token');
    var self = this;
    self.subscribe('invites-status', Template.instance().token);
    self.subscribe('users');
});

Template.AcceptInvite.helpers({
   valid: () => {
       if(InvitesCollection.findOne()){
           const token = Template.instance().token;
           var invite = InvitesCollection.findOne({'token': token});

           if(invite.status == 'invited' || invite.status == 'visited'){
               Meteor.call('invitesVisited', token);
               Meteor.loginWithInvite({inviteToken: token });
           }
           if(invite.status == 'claimed')
               FlowRouter.redirect('/');
       }
       else if(!Meteor.users.findOne()){
           const token = Template.instance().token;
           Meteor.loginWithInvite({inviteToken: token});
       }

       return true;
   }
});

Template.AcceptInvite.events({
    'submit form': function(event) {
        event.preventDefault();
        Accounts.createUser({
            email: event.target.email.value,
            password: event.target.password.value
        });
    }
});