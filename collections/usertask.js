usertask = new Mongo.Collection('usertask');
if(Meteor.isServer){
Meteor.methods({
    'usertask.add'(taskId, userId, variables){
        const check = usertask.find({'taskId': taskId, 'userId': userId}).count();

        if(check == 0){
            usertask.insert({
                taskId,
                userId,
                //variables,
            });
            Meteor.call('variables.add', variables);
        }
    },
    'usertask.remove'(taskId, userId){
        const userTask = usertask.find({'taskId' : taskId, 'userId' : userId});
        userTask.forEach(function (element) {
            usertask.remove({'_id' : element._id});
            variables.remove({task: taskId, user: userId});
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

        let step;

        task.steps.forEach(function (element) {
            if(element._id == stepId){
                step = element;
            }
        });

        let completionType;

        for(type of Types){
            if(type.value == step.completionType)
                completionType = type.label;
        }
        console.log(typeof completionType);
        let progress = {
            '_id': Random.id(),
            'stepId': stepId,
            'result': result,
            'completionType': completionType,
            'checked': !step.notify,
        };


        if(step.notify)
            notifications.insert({
                text: user.profile.firstName + " " + user.profile.lastName + " has completed step " + step.name + " in task " + task.name,
                href: Meteor.absoluteUrl() + "admin/tasks/" + task._id + '/results/' + Meteor.userId() + "?p=" + progress._id,
            });

        let UserTask = usertask.findOne({taskId: task._id, userId: Meteor.userId()});

        usertask.update(UserTask._id, {$push:  { 'progress': progress }}, function (error, result) {
            console.log(error, result, progress)
        });
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
        usertask.update({
                progress: {$elemMatch: {_id: progressId}}
            },
            { $set: {
                'progress.$.checked': true,
                }
            },
        );
    },
    'usertask.update-variables'(taskId, userId, variables){
        usertask.update({taskId: taskId, userId: userId}, {$set: {variables: variables}});
    }
});
}

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
    variables: {
        type: Object,
        optional: true,
        blackbox: true,
    },
    progress: {
        type: [ProgressSchema],
        optional: true
    }
});


usertask.attachSchema(UserTaskSchema);