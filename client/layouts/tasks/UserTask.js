Meteor.subscribe('tasks');
Meteor.subscribe('usertask');

Template.UserTask.helpers({
    step: (par)=> {
        var Step = null;
        var userTask = usertask.findOne({'userId' : Meteor.userId(), 'taskId': par});
        var task = tasks.findOne({'_id': par});
        task['steps'].forEach( function (element) {
            if(element._id == userTask['activeStepId'])
                Step = element;
        });
        if(userTask['activeStepId'] == 1)
            Step = { name: 'Completed'};
        return Step;
        },
        userInput: (par, _id) => {
            switch(par){
                case 'Text':
                    return 'textTemplate';
                    break;
                case 'Button':
                    return 'buttonTemplate';
                    break;
                case 'Image':
                    return 'uploadTemplate';
                    break;
                default:
                    break;
        }
    },
});

Template.UserTask.events({
    'submit .completion-text': function (event, tmpl) {
        event.preventDefault();
        Meteor.call('usertask.progress', $(event.target).data('id'), event.target.text.value);
        event.target.text.value = '';
    },
    'click .completion-button': function (event) {
        console.log($(event.target).data('id'));
        Meteor.call('usertask.progress', $(event.target).data('id'), 'Completed');
    }
});
