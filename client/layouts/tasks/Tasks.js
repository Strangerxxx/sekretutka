var completionType = new ReactiveVar();

Template.Tasks.onCreated(function () {
    Tracker.autorun(function () {
        if(Meteor.userId()) {
            Meteor.subscribe('tasks', Meteor.userId());
            Meteor.subscribe('usertask', Meteor.userId());
        }
    });
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