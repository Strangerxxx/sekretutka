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
                    if(_var.name == match[0])
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


Template.UserVariablesModal.helpers({
    displayName: (name) => {
        return fields.findOne({name: name}).displayName;
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