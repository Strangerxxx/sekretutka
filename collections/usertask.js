//Todo: many2many rel. see https://github.com/aldeed/meteor-collection2/issues/31

usertask = new Mongo.Collection('usertask');

Meteor.methods({
    'usertask.add'(taskId, userId){
        const check = usertask.find({'taskId': taskId, 'userId': userId}).count();
        const task = tasks.findOne({ "_id" : taskId});
        const activeStepId = task.steps[0]._id;
        if(check == 0){
            usertask.insert({
                userId,
                taskId,
                activeStepId
            });
        }
    },
    'usertask.remove'(taskId, userId){
        const userTask = usertask.find({'taskId' : taskId, 'userId' : userId});
        userTask.forEach(function (element) {
            usertask.remove({'_id' : element._id});
        });
    },
    'usertask.removeTask'(taskId){
        const userTask = usertask.find({'taskId': taskId});
        userTask.forEach(function (element) {
            usertask.remove({'_id': element._id});
        });
    },
    'usertask.progress'(stepId, result){
        var progress = {
            'stepId': stepId,
            'result': result
        };
        task = usertask.findOne({'activeStepId': stepId});
        usertask.update({'activeStepId': stepId}, {$push:  { 'progress': progress } });
        var nextStep = 0;
        tasks.findOne( { steps: {$elemMatch: {_id: stepId}}}).steps.forEach(function (step) {
            if(nextStep==1)
                nextStep = step._id;
            if(step._id == stepId)
                nextStep++;
        });
        usertask.update({'activeStepId': stepId}, {$set: {'activeStepId': nextStep} });
    }
});