
Template.UserLayout.helpers({
    username: () => {
        return Meteor.user().username;
    },
});