import { Meteor } from 'meteor/meteor';


Accounts.onCreateUser(function (options, user) {
    if(Meteor.users.find().fetch().length == 0){  // Makes 1st registered user admin
        user.roles = ['admin'];
    }
    user.profile = options.profile;
    return user;
});
Accounts.validateNewUser(function(user) {
    if(Meteor.users.find().fetch().length == 0) return true;
    var invite = invites.findOne({_id: user.profile.invite});
    if(invite && invite.status != 'claimed') {
        Meteor.call('invites.set-claimed', user.profile.invite);
        return true;
    }
    else throw new Meteor.Error(403, 'Invite not found or claimed');
});