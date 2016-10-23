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

var HelloButton = function (context) {
    var ui = $.summernote.ui;
    // create button
    var button = ui.button({
        contents: '<i class="fa fa-asterisk btn-var"/>',
        tooltip: 'Variable',
        click: function () {
            $('.summernote').summernote('insertText', '<var></var>');
        }
    });

    return button.render();   // return button as jquery object
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
        allowedValues: ['Text', 'Image', 'Button'],
        autoform: {
            afFieldInput: {
                firstOption: "(Select a completion type)"
            }
        }
    },
    description: {
        type: String,
        label: "Description",
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'summernote', // optional
                settings:{ // summernote options goes here
                    height: 250,
                    toolbar: [
                        ['mybutton', ['variable']]
                    ],
                    buttons: {
                        variable: HelloButton,
                    },
                }
            }
        }
    },
    notify: {
        type: Boolean,
        label: "Notify me",
    }
});

TaskSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name"
    },
    description: {
        type: String,
        label: "Description",
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor', // optional
                settings:{
                    height: 250,
                }
            }
        }
    },
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