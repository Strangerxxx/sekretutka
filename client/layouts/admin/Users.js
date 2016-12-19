Template.Users.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('users', Meteor.userId());
        self.subscribe('invites', null, Meteor.userId());
    });
    var clipboard = new Clipboard('.get-link');
});

Template.Users.helpers({
    "datetime":function(){
        var d = new Date(this.createdAt);
        return d.toLocaleString();
    },
    "invites":function(){
        return invites.find();
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
    acceptInviteUrl: () => {
        return Meteor.absoluteUrl() + 'acceptInvite/';
    },
    demoUrl: () => {
        return Meteor.absoluteUrl() + 'demo/';
    },
    claimed: (_id, status) => {
        if(status != 'claimed')
            return;
        let user = Meteor.users.findOne({'profile.invite': _id});
        return 'by ' + user.profile.firstName + ' ' + user.profile.lastName;
    }
});

Template.Users.events = {
    'submit form.inviteCreate': function (event, template) {
        event.preventDefault();
        Meteor.call('invites.create', Meteor.userId());
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
        Meteor.call("invites.delete", Meteor.userId(), $(e.currentTarget).attr('data-id'));
    },
    'click a.user-delete':function(e,t) {
        Meteor.call("users.delete", $(e.currentTarget).attr('data-id'));
    },
    'click .get-link': () => {
        Toast.success('Copied to clipboard');
    },
    'click .createInvite': () => {
        Meteor.call('invites.create', Meteor.userId());
    }
};