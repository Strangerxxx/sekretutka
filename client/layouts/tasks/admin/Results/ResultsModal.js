Template.ResultModal.onCreated(function () {
    this.subscribe('usertask');
    this.subscribe('tasks');
    this.subscribe('users', Meteor.userId());
});

var thisImage = new ReactiveVar();

Template.ResultModal.helpers({
    subscriptionsReady: () => usertask.find().count(),
    progress: () => {
        if(usertask.find().count()){
            var results = usertask.findOne({'taskId': FlowRouter.getParam('taskId'), 'userId': FlowRouter.getParam('userId')}).progress;
            var progress;
            var resultId = FlowRouter.getQueryParam('p');
            results.forEach(function (element) {
                if(element._id == resultId)
                    progress = element;
            });
            return progress;
        }
    },
    step: (stepId) => {
        var task = tasks.findOne(FlowRouter.getParam('taskId'));
        var step;
        task.steps.forEach(function (element) {
            if(element._id == stepId)
                step = element;
        });
        return step.name;
    },
    name: () => {
        var user = Meteor.users.findOne(FlowRouter.getParam('userId'));
        return user.profile.firstName + " " + user.profile.lastName;
    },
    image: (cType, src) => {
        if(cType=='Image'){
            thisImage.set(src);
            return true;
        }
        else
            return false;
    },

    imageFile: function (src) {
        var image = Images.findOne({_id: thisImage.get()});
        return image;
    },

    variables: (stepId) => {
        let userTask = usertask.findOne({taskId: FlowRouter.getParam('taskId'), userId: FlowRouter.getParam('userId')});
        let task = tasks.findOne({_id: FlowRouter.getParam('taskId')});
        let step = task.steps.find(function (element) {
            return element._id = stepId;
        });

        var vars = Blaze._globalHelpers.getVariablesFromText(task.description);
        let output = [];
        for(let variable in vars){
            if(vars.hasOwnProperty(variable))
            output.push({
                name: variable,
                value: userTask.variables[variable],
            })
        }
        vars = Blaze._globalHelpers.getVariablesFromText(step.description);
        for(let element in vars){
            if(vars.hasOwnProperty(element)) {
                if (userTask.variables.hasOwnProperty(element))
                    output.push({
                        name: element,
                        value: userTask.variables[element],
                    });
            }
        }
        return output;
    }
});

Template.ResultModal.events({
    'click .remove-submission': (event)=> {
        Meteor.call('usertask.remove-progress', FlowRouter.getParam('taskId'), $(event.target).data('progressid'), FlowRouter.getParam('userId'));
    },
    'click .set-checked': (event) => {
        Meteor.call('usertask.set-checked', $(event.target).data('progressid'));
    },
});
