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
