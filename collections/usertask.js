//Todo: many2many rel. see https://github.com/aldeed/meteor-collection2/issues/31

usertask = new Mongo.Collection('usertask');

Meteor.methods({
    'usertask.add'(taskId, userId){
        const check = usertask.find({'taskId': taskId, 'userId': userId}).count();
        const task = tasks.findOne({ "_id" : taskId});
        const activeStepId = task.steps[0]._id;
        if(check == 0){
            usertask.insert({
                taskId,
                userId,
                //activeStepId
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
        const task = tasks.findOne({'steps': {$elemMatch: {_id: stepId}}});
        var UserTask = usertask.findOne({taskId: task._id, userId: Meteor.userId()});
        usertask.update(UserTask._id, {$push:  { 'progress': progress } });
    }
});

ProgressSchema = new SimpleSchema({
    stepId: {
        type: tasks.steps,
    },
    result: {
        type: String,
    },
    ignore: {
        type: Boolean,
        optional: true,
    }
});

UserTaskSchema = new SimpleSchema({
    taskId: {
       type: tasks,
    },
    userId: {
        type: Meteor.users,
    },
    progress: {
        type: [ProgressSchema],
        optional: true
    }
});


usertask.attachSchema(UserTaskSchema);