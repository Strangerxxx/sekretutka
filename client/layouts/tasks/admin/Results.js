Meteor.subscribe('usertask');

Template.Results.helpers({
   results: () => {
       const taskId = FlowRouter.getParam('taskId');
       const userId = FlowRouter.getParam('userId');
       var userTask = usertask.findOne({'taskId': taskId, 'userId': userId});
       console.log(userTask.progress);
       var stepName;
       tasks.findOne({_id: taskId}).steps.forEach(function (element) {
            userTask.progress.forEach(function (result) {
                if(result.stepId == element._id)
                    result.name = element.name;
            });
       });

       return userTask.progress;
   },
});