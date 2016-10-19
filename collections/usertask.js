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
        const user = Meteor.users.findOne(Meteor.userId());

        var step;

        task.steps.forEach(function (element) {
            if(element._id == stepId){
                step = element;
            }
        });

        var progress = {
            '_id': Random.id(),
            'stepId': stepId,
            'result': result,
            'completionType': step.completionType,
            'checked': !step.notify,
        };
        if(step.notify)
            notifications.insert({text: user.profile.firstName + " " + user.profile.lastName + " has completed step " + step.name + " in task " + task.name});

        var UserTask = usertask.findOne({taskId: task._id, userId: Meteor.userId()});
        usertask.update(UserTask._id, {$push:  { 'progress': progress } });
    },
    'usertask.remove-progress'(taskId, progressId, userId){
        const thisUserTask = usertask.findOne({'taskId': taskId, userId: userId}, { fields: {progress: 1}});

        usertask.update({
            _id: thisUserTask._id,
            progress: {$elemMatch: {_id: progressId, ignored: false}}
            },
            { $set: {
                'progress.$.ignored': true,
                'progress.$.checked': true,
                }
            }
        );
    },
    'usertask.set-checked'(progressId){
        console.log(progressId);
        usertask.update({
                progress: {$elemMatch: {_id: progressId}}
            },
            { $set: {
                'progress.$.checked': true,
                }
            },
        );
    }
});

ProgressSchema = new SimpleSchema({
    _id: {
        type: String,
        autoValue: () => {
            if(this.isInsert)
                return Random.id();
        },
    },
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
    },
    checked: {
        type: Boolean,
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