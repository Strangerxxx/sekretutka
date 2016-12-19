var editMode = new ReactiveVar();

Template.AdminTask.onCreated(function () {
    Meteor.subscribe('tasks', Meteor.userId());
    Meteor.subscribe('users', Meteor.userId());
    Meteor.subscribe('usertask', Meteor.userId());
    Meteor.subscribe('files');
    editMode.set(false);

});

var imageToShow = new ReactiveVar(); //не нужен тут реактиввар

Template.AdminTask.helpers({
    users: ()=> {
        return Meteor.users.find({roles: {$nin: ['admin']}});
    },
    user: ()=> {
        var id = Template.currentData()._id;
        var dict = usertask.find({"taskId": id}).map(function (doc) {
            return doc.userId;
        });
        return Meteor.users.find({_id: {$in: dict}});
    },
    progress: (taskId, stepId)=>{
        var utArray = usertask.find({'taskId': taskId, 'progress': {$elemMatch: {stepId: stepId}}}).fetch();
        var users = [];

        utArray.forEach(function (element) {
            users.push(element.userId);
        });

        var emails = [];
        users.forEach(function (element) {
            emails.push(Meteor.users.findOne({_id: element}).emails[0].address);
        });

        var result = '';
        var data = [];

        for(var i=0; i<utArray.length; i++) {
            utArray[i].progress.forEach(function (element) {
                if (element.stepId == stepId){
                    if(element.completionType == 'Image'){
                        var image = Images.findOne({_id: element.result});
                        result = '<a href="'+image.link()+'" class="showImage" id="' + element.result + '">Image</a>';
                    }
                    else
                        result = element.result;
                }
            });

            data.push({
                email: emails[i],
                result: result
            });
        }
        return data;
    },
    editEnabled: ()=> {
        return editMode.get();
    },
    task: ()=> {
        return tasks.findOne({_id: FlowRouter.getParam('taskId')});
    },
    variables: (userId) => variables.find({taskId: FlowRouter.getParam('taskId'), userId: userId}),
});

Template.AdminTask.events({
    'click #delete-task': function () {
        Meteor.call('tasks.remove', this._id);
        FlowRouter.go('/admin/tasks');
    },
    'submit .attach-users': function (event, tmpl) {
        event.preventDefault();
        var userId = tmpl.find('.user-selected :selected').value;
        if(usertask.findOne({userId: userId, taskId: FlowRouter.getParam('taskId')})){
            let user = Meteor.users.findOne({_id: userId})
            Toast.error(`${user.profile.firstName} ${user.profile.lastName} is already attached to this task`);
        }
        else{
            var task = tasks.findOne(FlowRouter.getParam('taskId'));
            var steps = task.steps.map(function (element) {
                return element.description;
            });

            let t0 = performance.now();

            var _variables = Blaze._globalHelpers.getVariablesFromTask(task);

            let t1 = performance.now();
            console.log(`It took ${t1 - t0}`);

            let showModal = false;

            let varsArrayWithValues = [];
            let regExProfile = /profile\s(.*)/;
            let regExGlobal = /global\s(.*)/;
            let match;
            let user = Meteor.users.findOne({_id: userId});

            for(var key in _variables){
                if(_variables.hasOwnProperty(key)){
                    if(match = regExProfile.exec(key)){
                        varsArrayWithValues.push({
                            name: key,
                            value: user.profile[match[1]],
                            disabled: 'disabled',
                        })
                    }
                    else if(match = regExGlobal.exec(key)){
                        let global = variables.findOne({user: userId, task: null, name: match[0]});
                        if(global)
                            varsArrayWithValues.push({
                                name: key,
                                value: global.value,
                                disabled: 'disabled',
                            });
                        else
                            varsArrayWithValues.push({
                                name: key,
                                value: null,
                            });
                    }
                    else{
                        let val;
                        if(val = variables.findOne({user: userId, task: FlowRouter.getParam('taskId'), name: key}))
                            varsArrayWithValues.push({
                                name: key,
                                value: val.value,
                            });
                        else
                            varsArrayWithValues.push({
                                name: key,
                            })
                    }
                }
            }
            let show = false;
            for(_var of varsArrayWithValues) {
                if (_var.value == null) {
                    show = true;
                    break;
                }
            }
            if(_variables.length != 0 && show){
                Modal.show('VariablesModal', { variables: _variables, userId: userId, type: 'Attach' , varsArray: varsArrayWithValues});
            }
            else
                Meteor.call('usertask.add', this._id, userId, []);
        }
    },
    'click .unassign-user': function (event) {
        Meteor.call('usertask.remove', $(event.target).data('task'), $(event.target).data('user'));
    },
    'click #enableEdit': ()=> {
        editMode.set(true);
    },
    'click #submitEdit': ()=> {
        editMode.set(false);
    },
    'click #cancel': ()=> {
        editMode.set(false);
    },
    'click .edit-variables': (event) => {
        var variables = Blaze._globalHelpers.getVariablesFromTask(tasks.findOne(FlowRouter.getParam('taskId')));
        Modal.show('VariablesModal', {variables: variables, userId: $(event.target).data('user'), type: 'Edit'});
    }

});

Template.VariablesModal.onCreated(function () {


});

Template.VariablesModal.helpers({
    'variables': () => Template.instance().data.varsArray,
    'user': () => {
        user = Meteor.users.findOne(Template.instance().data.userId);
        return user;
    },
    'actionType': () => Template.instance().data.type,
});

Template.VariablesModal.events({
    'submit .variables-form': (event, tmpl) => {
         event.preventDefault();
         Modal.hide('VariablesModal');
         let regExProfile = /profile\s(.*)/;
         let regExGlobal = /global\s(.*)/;
        let match;

         var _variables = Template.instance().data.variables;
         let output = [];

         for(let variable in _variables){
             if(_variables.hasOwnProperty(variable)){
                 if(!regExProfile.exec(variable) && !regExGlobal.exec(variable)){
                     let value = $(`[name="${variable}"]`).val();
                     output.push({
                         name: variable,
                         value: value,
                         task: FlowRouter.getParam('taskId'),
                         user: Template.instance().data.userId,
                     });
                     _variables[variable] = value;
                 }
                 else if(match = regExGlobal.exec(variable)){
                     if(!variables.findOne({name: variable, user: Template.instance().data.userId}))
                        Meteor.call('variables.insert.one', match[0],Template.instance().data.userId,$(`[name="${variable}"]`).val());
                 }
             }
         }
         if(Template.instance().data.type == 'Attach')
             Meteor.call('usertask.add', FlowRouter.getParam('taskId'), Template.instance().data.userId, output);
         else if(Template.instance().data.type == 'Edit')
             Meteor.call('variables.update', FlowRouter.getParam('taskId'), Template.instance().data.userId, _variables);
    },
    'click .user-filled': (event) => {
        let input = $(`input.form-control[name = "${event.target.name}"]`);
        input.prop('disabled', !input.is(':disabled'));
    }
});

let hooksObject = {
    after: {
        update: (error, id) => {
            let regEx = /global\s(.*)/;
            let match, matches = [];
            let variables = Blaze._globalHelpers.getVariablesFromTask(tasks.findOne({_id: FlowRouter.getParam('taskId')}));
            for(let variable in variables){
                if(variables.hasOwnProperty(variable)){
                    if(match = regEx.exec(variable)){
                        if(!fields.findOne({name: variable}))
                            matches.push({
                                name: variable,
                            });
                    }
                }
            }
            if(matches.length != 0){
                Modal.show('globalVariablesModal', {matches: matches, action: 'updated'}, {
                    backdrop: 'static',
                    keyboard: false
                });
            }
        }
    }
};

AutoForm.hooks({
    updateTask: hooksObject
});