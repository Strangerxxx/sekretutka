Template.buttonTemplate.events({
    'click .completion-button': function (event) {
        Meteor.call('usertask.progress', event.target.id, 'Completed');
    },
});