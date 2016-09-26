tasks = new Mongo.Collection('tasks');

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


StepsSchema = new SimpleSchema({
    _id: {
        type: String,
        label: '_id',
        autoValue: function () {
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
    description: {
        type: String,
        label: "Description"
    },
    completionType: {
        type: String,
        allowedValues: ['Text', 'Image', 'Button'],
        autoform: {
            afFieldInput: {
                firstOption: "(Select a completion type)"
            }
        }
    },
});

TaskSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name"
    },
    description: {
        type: String,
        label: "Description"
    },
    steps: {
        type: [StepsSchema],
    }
});

tasks.attachSchema(TaskSchema);