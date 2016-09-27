Meteor.subscribe('tasks');
Meteor.subscribe('usertask', Meteor.userId());
Meteor.subscribe('files');

Template.uploadTemplate.onCreated(function () {
    this.currentUpload = new ReactiveVar(false);
});

Template.UserTask.helpers({
    step: (par)=> {
        var Step = null;
        var userTask = usertask.findOne({'userId': Meteor.userId(), 'taskId': par});
        var task = tasks.findOne({'_id': par});
        if (userTask){
            if (userTask.progress == undefined)
                return task.steps[0];
            else {
                for (var i = 0; i < task['steps'].length; i++) {
                    for (var t = 0; t < userTask.progress.length; t++) {
                        if (task.steps[i]._id == userTask.progress[t].stepId)
                            break;

                        if (t == (userTask.progress.length - 1))
                            return task.steps[i];
                    }
                }
            }
        }

        return { name: 'Completed'};
    },
    userInput: (par, _id) => {
        switch(par){
            case 'Text':
                return 'textTemplate';
                break;
            case 'Button':
                return 'buttonTemplate';
                break;
            case 'Image':
                return 'uploadTemplate';
                break;
            default:
                break;
        }
    },
    task: () => {
        return tasks.findOne({_id: FlowRouter.getParam('taskId')});
    }
});

Template.UserTask.events({
    'submit .completion-text': function (event, tmpl) {
        event.preventDefault();
        Meteor.call('usertask.progress', $(event.target).data('id'), event.target.text.value);
        event.target.text.value = '';
    },
    'click .completion-button': function (event) {
        console.log($(event.target).data('id'));
        Meteor.call('usertask.progress', $(event.target).data('id'), 'Completed');
    }
});

Template.uploadTemplate.helpers({
   currentUpload: function () {
       return Template.instance().currentUpload.get();
   }
});

Template.uploadTemplate.events({
   'change .fileInput': function (event, template) {
       if(event.currentTarget.files && event.currentTarget.files[0]) {
           var file = event.currentTarget.files[0];

           if(file) {
               var uploadInstance = Images.insert({
                   file: file,
                   streams: 'dynamic',
                   chunkSize: 'dynamic',
               }, false);

               uploadInstance.on('start', function () {
                   template.currentUpload.set(this);
                   console.log('test')
               });

               uploadInstance.on('end', function (error, fileObj) {
                   if(error)
                       alert('Error during upload' + error.reason);
                   else
                       Meteor.call('usertask.progress', event.target.id, fileObj._id);
               });

               uploadInstance.start();
           }
       }
   }
});
