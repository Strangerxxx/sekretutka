Template.Register.onCreated(function () {
    Template.instance().token = FlowRouter.getParam('token');
    var self = this;
    self.subscribe('invites-status', Template.instance().token);
});

Template.Register.helpers({
   valid: () => {
       if(InvitesCollection.findOne()){
           const token = Template.instance().token;
           var invite = InvitesCollection.findOne({'token': token});
           console.log(invite.status);
           if(invite.status == 'invited' || invite.status == 'visited'){
               Meteor.call('invitesVisited', token);
               Meteor.loginWithInvite({inviteToken: token }, function (error) {
                   console.log(error);
               });
               return true;
           }
       }
   }
});