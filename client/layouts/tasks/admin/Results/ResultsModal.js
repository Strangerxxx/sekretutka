Template.ResultModal.onCreated(function () {
    this.subscribe('usertask', Meteor.userId());
    this.subscribe('tasks', Meteor.userId());
    this.subscribe('users', Meteor.userId());
    this.subscribe('files');
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
        let localVars = variables.find({user: FlowRouter.getParam('userId'), task: FlowRouter.getParam('taskId')}).fetch();
        let globalVars = variables.find({user: FlowRouter.getParam('userId'), task: null}).fetch();

        var vars = Blaze._globalHelpers.getVariablesFromText(task.description);
        let output = [];
        for(let variable in vars){
            if(vars.hasOwnProperty(variable)){
                for(let localVar of localVars)
                {
                    if(localVar.name == variable){
                        output.push({
                            name: variable,
                            value: localVar.value,
                        });
                        break;
                    }
                }
                for(let globalVar of globalVars){
                    if(globalVar.name == variable){
                        output.push({
                            name: variable,
                            value: globalVar.value,
                        });
                        break;
                    }
                }
            }

        }
        vars = Blaze._globalHelpers.getVariablesFromText(step.description);
        for(let variable in vars){
            if(vars.hasOwnProperty(variable)) {
                for(let localVar of localVars)
                {
                    if(localVar.name == variable){
                        output.push({
                            name: variable,
                            value: localVar.value,
                        });
                        break;
                    }
                }
                for(let globalVar of globalVars){
                    if(globalVar.name == variable){
                        output.push({
                            name: variable,
                            value: globalVar.value,
                        });
                        break;
                    }
                }
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
