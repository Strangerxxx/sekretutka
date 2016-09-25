Meteor.subscribe('tasks');
Meteor.subscribe('dictionary');
Meteor.subscribe('usertask');

var completionType = new ReactiveVar();

Template.Tasks.helpers({
    tasks: ()=> {
        if(Roles.userIsInRole(Meteor.userId(), 'admin'))
        {
            return tasks.find();
        }
        else {
            var dict = usertask.find({"userId": Meteor.userId()}).map(function (doc) {
                return doc.taskId;
            });
            return tasks.find({_id: {$in: dict}});
        }
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