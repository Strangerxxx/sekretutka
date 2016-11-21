Template.UserTask.onCreated(function () {
    this.subscribe('usertask', Meteor.userId());
    this.subscribe('tasks', Meteor.userId());
    this.subscribe('variables');
    this.subscribe('fields');
});

Template.UserTask.onRendered(function () {
    this.autorun(function () {
        if(Template.instance().subscriptionsReady()){
            let _variables = variables.find({user: Meteor.userId(), task: FlowRouter.getParam('taskId')}).fetch();
            let globals = variables.find({user: Meteor.userId(), task: null}).fetch();
            let toFill = [];
            for(let _var of _variables) {
                if(!_var.value){
                    toFill.push(_var);
                }
            }
            for(let _global of globals){
                if(!_global.value){
                    toFill.push(_global);
                }
            }
            if(toFill.length != 0){
                Modal.show('UserVariablesModal', {toFill}, {
                    backdrop: 'static',
                    keyboard: false
                });
            }
        }
    });
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
        var globalVars = variables.find({task: null, user: Meteor.userId()}).fetch();

        const regEx = /&lt;v&gt;(.+?)&lt;\/v&gt;/g;
        let regExProfile = /profile\s(.*)/;
        let regExGlobal = /global\s(.*)/;
        let match;

        return text.replace(regEx, function(s, key) {
            if(match = regExProfile.exec(key))
                return Meteor.user().profile[match[1]];
            else if(match = regExGlobal.exec(key)){
                for(_var of globalVars)
                    if(_var.name == match[1])
                        return _var.value;
            }
            else{
                for(Var of vars){
                    if(Var.name == key)
                        return Var.value;
                }
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

Template.UserVariablesModal.helpers({
    displayName: (name) => {
        return fields.findOne({name: 'global ' + name}).displayName;
    }
});

Template.UserVariablesModal.events({
    'submit .userVarForm': (event) => {
        event.preventDefault();
        for(_var of Template.instance().data.toFill){
            Meteor.call('variables.update.one', _var._id, $(`input[name="${_var.name}"]`).val());
        }
        Modal.hide('UserVariablesModal');
    }
});