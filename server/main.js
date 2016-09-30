import { Meteor } from 'meteor/meteor';


Accounts.onCreateUser(function (options, user) {
    if(Meteor.users.find().fetch().length == 0){  // Makes 1st registered user admin
        user.roles = ['admin'];
    }
    return user;
});