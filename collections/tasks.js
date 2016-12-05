tasks = new Mongo.Collection('tasks');

Meteor.methods({
    'tasks.remove': (taskId) => {
        tasks.remove(taskId);
        Meteor.call('usertask.removeTask', taskId);
        Meteor.call('variables.removeTask', taskId);
    }
});

tasks.allow({
    insert: function (userId, doc) {
        if(Roles.userIsInRole(userId, 'admin'))
            return !!userId;
    },
    remove: function (userId, doc) {
        if(Roles.userIsInRole(userId, 'admin'))
            return !!userId;
    },
    update: function (userId, doc) {
        if(Roles.userIsInRole(userId, 'admin'))
            return !!userId;
    }
});

const description = {
    type: String,
    label: "Description",
    autoform: {
        afFieldInput: {
            type: 'froala',
            height: 300,
            toolbarButtons: [
                'fontSize', '|', 'bold', 'italic', 'underline', 'strikeThrough','|',
                'color', '|', 'formatOL', 'formatUL', 'insertHR',
                'insertLink', 'insertImage', 'myButton'
            ],
            fontSizeSelection: true,

        }
    }
};


StepsSchema = new SimpleSchema({
    _id: {
        type: String,
        label: '_id',
        autoValue: function () {
            if(this.isInsert)
                return Random.id();
            if(!this.isSet)
                return Random.id();
        },
        autoform: {
            type: 'hidden'
        }
    },
    name:{
        type: String,
        label: "Name",
    },
    completionType: {
        type: String,
        allowedValues: ["textTemplate", "buttonTemplate", uploadTemplate],
        autoform: {
            options: () => Types,
            afFieldInput: {
                firstOption: "(Select a completion type)"
            }
        }
    },
    description: description,
    notify: {
        type: Boolean,
        label: "Notify me",
    },
});

TaskSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name"
    },
    description: description,
    steps: {
        type: [StepsSchema],
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if(this.isInsert)
                return new Date();
        },
        autoform: {
            type: 'hidden'
        }
    }
});

tasks.attachSchema(TaskSchema);