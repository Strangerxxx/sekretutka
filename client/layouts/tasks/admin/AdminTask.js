Meteor.subscribe('tasks', Meteor.userId());
Meteor.subscribe('users', Meteor.userId());
Meteor.subscribe('usertask', Meteor.userId());
Meteor.subscribe('files');

var editMode = new ReactiveVar();
editMode.set(false);

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
    }
});

Template.AdminTask.events({
    'click #delete-task': function () {
        tasks.remove(this._id);
        Meteor.call('usertask.removeTask', this._id); //delete all connections with users from usertask
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

            var variables = Blaze._globalHelpers.getVariablesFromTask(task);

            if(variables.length != 0)
                Modal.show('VariablesModal', {variables: variables, userId: userId});
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

});

Template.VariablesModal.onCreated(function () {

});

Template.VariablesModal.helpers({
    'variables': () => {
        return Template.instance().data.variables;
    },
    'user': () => {
        user = Meteor.users.findOne(Template.instance().data.userId);
        return user;
    }
});

Template.VariablesModal.events({
   'submit .variables-form': (event, tmpl) => {
        event.preventDefault();
        Modal.hide('VariablesModal');
        var variables = [];
        Template.instance().data.variables.forEach(function (element) {
            variables.push({
                name: element.name,
                value: $('#'+element.name).val(),
                stepId: element.stepId
            });
        });
        Meteor.call('usertask.add', FlowRouter.getParam('taskId'), Template.instance().data.userId, variables);
   }
});