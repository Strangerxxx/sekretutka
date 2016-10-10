usertask = new Mongo.Collection('usertask');

Meteor.methods({
    'usertask.add'(taskId, userId){
        const check = usertask.find({'taskId': taskId, 'userId': userId}).count();
        const task = tasks.findOne({ "_id" : taskId});
        //const activeStepId = task.steps[0]._id;
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
        const task = tasks.findOne({'steps': {$elemMatch: {_id: stepId}}});
        var completionType;
        task.steps.forEach(function (element) {
            if(element._id == stepId)
                completionType = element.completionType;
        });
        var progress = {
            'stepId': stepId,
            'result': result,
            'completionType': completionType,
        };
        var nextStep;
        var UserTask = usertask.findOne({taskId: task._id, userId: Meteor.userId()});
        
        usertask.update(UserTask._id, {$push:  { 'progress': progress } });
    },
    'usertask.remove-progress'(taskId, stepId, userId){
        const thisUserTask = usertask.findOne({'taskId': taskId, userId: userId});

        usertask.update({
            _id: thisUserTask._id,
            progress: {$elemMatch: {stepId: stepId, ignored: false}}
            },
            { $set: {'progress.$.ignored': true } }
        );
    }
});

ProgressSchema = new SimpleSchema({
    stepId: {
        type: tasks.steps,
    },
    result: {
        type: String,
    },
    completionType: {
        type: String,
        allowedValues: ['Text', 'Image', 'Button'],
    },
    ignored: {
        type: Boolean,
        autoValue: function () {
            if(!this.isSet)
                return false;
        },
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            return new Date();
        },
        autoform: {
            type: 'hidden'
        }
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