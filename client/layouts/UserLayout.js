Template.UserLayout.onCreated(function () {
    this.autorun(() => {
        if (this.subscriptionsReady() && Roles.userIsInRole(Meteor.user(), 'admin')) {
            FlowRouter.go('admin');
        }
    });
});

Template.UserLayout.helpers({
    username: () => {
        return Meteor.user().username;
    },
});