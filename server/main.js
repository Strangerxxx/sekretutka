import { Meteor } from 'meteor/meteor';

// Meteor.autorun(function () {
//     if(Meteor.userId())
//     {
//         if(Meteor.users.find().fetch())
//     }
// })

if(Meteor.users.find().fetch().length == 1){  // Makes 1st registered user amin
    const user = Meteor.users.findOne();
    console.log(user);
    Roles.addUsersToRoles(user, 'admin');
}