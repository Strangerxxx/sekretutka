Template.Users.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('invites-all');
        self.subscribe('requests-all');
        self.subscribe('users-all');
    });
    var clipboard = new Clipboard('.get-link');
});

Template.Users.helpers({
    "datetime":function(){
        var d = new Date(this.createdAt);
        return d.toLocaleString();
    },
    "invites":function(){
        return InvitesCollection.find();
    },
    "users":function(){
        return Meteor.users.find();
    },
    "allowInvite":function(){
        return this.status == "requested" || this.status == "confirmed";
    },
    // "name":function(){
    //   return
    // },
    "inviteToken":function(){
        var t = "";
        if(this.services && this.services.accountsInvite){
            t = this.services.accountsInvite.inviteToken;
        }
        return t;
    },
    "inviteType":function(){
        var t = "";
        if(this.services && this.services.accountsInvite){
            t = this.services.accountsInvite.inviteType;
        }
        return t;
    },
    "services":function(){
        // String of services registered to this user
        return _.chain(this.services)
            .map(function(v,k,l){ return k })
            .filter(function(k){ return k != "resume"})
            .value()
            .join(", ");
    },
    url: () => {
        return Meteor.absoluteUrl() + 'acceptInvite/';
    }
});

Template.Users.events = {
    'submit form.inviteCreate': function (event, template) {
        event.preventDefault();
        var inviteEmail = template.find('#inviteEmail').value;
        Meteor.call('invitesCreate', inviteEmail, true);
    },
    'click a.invite-reset': function(e,t) {
        Meteor.call("invitesReset", $(e.currentTarget).attr('data-id'));
    },
    'click a.invite-revoke': function(e,t) {
        Meteor.call("invitesRevoke", $(e.currentTarget).attr('data-id'));
    },
    'click a.request-delete': function(e,t) {
        Meteor.call("requestsDelete", $(e.currentTarget).attr('data-id'));
    },
    'click a.invite-delete': function(e,t) {
        Meteor.call("invitesDelete", $(e.currentTarget).attr('data-id'));
    },
    'click a.user-delete':function(e,t) {
        Meteor.call("deleteUser", $(e.currentTarget).attr('data-id'));
    },
    'click .get-link': () => {
        Toast.success('Copied to clipboard');
    }
};