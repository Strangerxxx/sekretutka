Template.AddTask.onCreated(function () {
    Meteor.subscribe('files');
});