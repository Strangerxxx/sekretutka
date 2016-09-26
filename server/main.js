import { Meteor } from 'meteor/meteor';

// Meteor.autorun(function () {
//     if(Meteor.userId())
//     {
//         if(Meteor.users.find().fetch())
//     }
// })

Accounts.onCreateUser(function (options, user) {

    if(Meteor.users.find().fetch().length == 0){  // Makes 1st registered user admin
        user.roles = ['admin'];
    }
    console.log(user);
    return user;
});
