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