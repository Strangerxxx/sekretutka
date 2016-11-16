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
        return Meteor.users.find({}, {skip: 1});
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

            var variables = Blaze._globalHelpers.getVariablesFromTask(task);

            let t1 = performance.now();
            console.log(`It took ${t1 - t0}`);

            if(variables.length != 0)
                Modal.show('VariablesModal', {variables: variables, userId: userId, type: 'Attach'});
            else
                Meteor.call('usertask.add', this._id, userId);
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
        let varobject = {};
        let vars = variables.find({user: $(event.target).data('user'), task: FlowRouter.getParam('taskId')}).fetch();
        for(let variable of vars){
            varobject[variable.name] = variable.value;
        }
        Modal.show('VariablesModal', {variables: varobject, userId: $(event.target).data('user'), type: 'Edit'});
    }

});

Template.VariablesModal.onCreated(function () {

});

Template.VariablesModal.helpers({
    'variables': () => {
        let vars = [];
        let regEx = /profile\s(.*)/;
        let match;
        let user = Meteor.users.findOne({_id: Template.instance().data.userId});

        if(Template.instance().data.type == 'Edit'){
            let _variables = variables.find({task: $(event.target).data('task'), user: $(event.target).data('user')}).fetch();

            for(var key in Template.instance().data.variables){
                if(Template.instance().data.variables.hasOwnProperty(key)){
                    if(match = regEx.exec(key))
                        Template.instance().data.variables[key] =  user.profile[match[1]];
                    else{
                        for(let _var of _variables){
                            if(_var.name == key)
                                vars.push({
                                    name: key,
                                    value: _var.value,
                                })
                        }
                    }
                }
            }
        }
        else if(Template.instance().data.type == 'Attach'){
            for(var key in Template.instance().data.variables){
                if(Template.instance().data.variables.hasOwnProperty(key)){
                    if(match = regEx.exec(key))
                        Template.instance().data.variables[key] =  user.profile[match[1]];
                    else
                        vars.push({
                            name: key,
                            value: Template.instance().data.variables[key],
                        })
                }
            }
        }
        return vars;
    },
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
        let regEx = /profile\s(.*)/;

        var variables = Template.instance().data.variables;
        let output = [];

        for(let variable in variables){
            if(variables.hasOwnProperty(variable)){
                if(!regEx.exec(variable)){
                    let value = $(`[name="${variable}"]`).val()
                    output.push({
                        name: variable,
                        value: value,
                        task: FlowRouter.getParam('taskId'),
                        user: Template.instance().data.userId,
                    });
                    variables[variable] = value;
                }
            }
        }
        if(Template.instance().data.type == 'Attach')
            Meteor.call('usertask.add', FlowRouter.getParam('taskId'), Template.instance().data.userId, output);
        else if(Template.instance().data.type == 'Edit')
            Meteor.call('variables.update', FlowRouter.getParam('taskId'), Template.instance().data.userId, variables);



   }
});