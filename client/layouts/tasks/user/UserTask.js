

Template.UserTask.onCreated(function () {
    this.subscribe('usertask');
    this.subscribe('tasks');
    this.subscribe('variables');
});

Template.UserTask.helpers({
    completed: (name) =>{return name == 'Completed'},
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
                        if (task.steps[i]._id == userTask.progress[t].stepId && userTask.progress[t].ignored == false){
                            if(userTask.progress[t].checked == false) {
                                return {
                                    _id: task.steps[i]._id,
                                    name: task.steps[i].name,
                                    description: task.steps[i].description,
                                };
                            }
                            else
                                break;
                        }

                        if (t == (userTask.progress.length - 1))
                            return task.steps[i];
                    }
                }
            }
        }
        return { name: 'Completed'};
    },
    userInput: (par) => {
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
    },
    desc: (text) => {
        var userTask = usertask.findOne({taskId: FlowRouter.getParam('taskId')});
        var vars = variables.find({task: FlowRouter.getParam('taskId'), user: Meteor.userId()}).fetch();

        const regEx = /&lt;v&gt;(.+?)&lt;\/v&gt;/g;

        return text.replace(regEx, function(s, key) {
            for(Var of vars){
                if(Var.name == key)
                    return Var.value;
            }
        });
    }
});


Template.uploadTemplate.onCreated(function () {
    this.currentUpload = new ReactiveVar(false);
    Meteor.subscribe('usertask', Meteor.userId());
    Meteor.subscribe('tasks', Meteor.userId());
    Meteor.subscribe('files');
});
Template.UserTask.events({
    'submit .completion-text': function (event, tmpl) {
        event.preventDefault();
        if(event.target.text.value){
            Meteor.call('usertask.progress', event.target.id, event.target.text.value);
            event.target.text.value = '';
        }
        else
            Toast.warning('Message is empty');
    },
    'click .completion-button': function (event) {
        Meteor.call('usertask.progress', event.target.id, 'Completed');
    },

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
               });

               uploadInstance.on('end', function (error, fileObj) {
                   if(error)
                       alert('Error during upload' + error.reason);
                   else{
                       Meteor.call('usertask.progress', event.target.id, fileObj._id);
                       template.currentUpload.set(false);
                   }

               });

               uploadInstance.start();
           }
       }
   }
});
