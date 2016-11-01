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

var VariableButton = function (context) {
    var ui = $.summernote.ui;

    // create button
    var button = ui.button({
        className: 'btn-var',
        contents: '<i class="fa fa-asterisk"></i>',
        tooltip: 'Variable',
        click: function(e){
            $($(e.target).parents('.note-editor')[0]).siblings('.summernote').summernote('insertText', '<v></v>');
        }
    });
    return button.render();   // return button as jquery object
};

const description = {
    type: String,
    label: "Description",
    autoform: {
        afFieldInput: {
            type: 'summernote',
            class: 'summernote', // optional
            settings:{ // summernote options goes here
                height: 250,
                toolbar:[
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['fontsize', ['fontsize']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['picture', 'link', 'video']],
                    ['variable',['variable']],
                    ['misc', ['fullscreen', 'help']]
                ],
                buttons:{
                    variable: VariableButton
                },
                callbacks: {
                    onImageUpload: function (files) {
                        var uploadInstance = Images.insert({
                            file: files[0],
                            streams: 'dynamic',
                            chunkSize: 'dynamic',
                        }, false);

                        uploadInstance.on('end',(err, fileObj)=>{
                            let image = Images.findOne(fileObj._id);
                            $(this).summernote('insertImage', image.link());
                        });
                        uploadInstance.start();

                    }
                }
            }
        }
    }
}

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
    description: description,
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