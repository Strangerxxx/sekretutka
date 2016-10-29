var completionType = new ReactiveVar();

Template.Tasks.onCreated(function () {
    Meteor.subscribe('usertask', Meteor.userId());
    if(Roles.userIsInRole(Meteor.userId(), 'admin'))
        Meteor.subscribe('tasks', Meteor.userId());
    else{
        Tracker.autorun(function () {
            usertask.find().observeChanges({
                added: () => {
                    Meteor.subscribe('tasks', Meteor.userId());
                },
                removed: () => {
                    Meteor.disconnect();
                    Meteor.reconnect();
                    Meteor.subscribe('tasks', Meteor.userId());
                }
            })
        })
    }
});

Template.Tasks.helpers({
    tasks: ()=> {

        return tasks.find();
    },
});

Template.uploadTemplate.helpers({
   completionCallback: (stepId)=> {
        return{
            finished: function (index, fileInfo, context) {
                Meteor.call('usertask.progress', stepId, fileInfo.name);
            }
        }
   },
});