Template.Results.onCreated(function () {
    this.subscribe('usertask', Meteor.userId());

    this.subscribe('tasks', Meteor.userId());

    this.subscribe('users', Meteor.userId());

    Template.instance().taskId = FlowRouter.getParam('taskId');
    Template.instance().userId = FlowRouter.getParam('userId');
    this.subscribe('files');

    Tracker.autorun(function() {
        FlowRouter.watchPathChange();
        var currentContext = FlowRouter.current();
        if(currentContext.queryParams.p)
            Modal.show('ResultModal');
    });
});

var imageToShow = new ReactiveVar();

Template.Results.helpers({
     subscriptionsReady: () => Meteor.users.find().count() && tasks.find().count() && usertask.find().count(),
     userName: () => {
         const user = Meteor.users.findOne({_id: Template.instance().userId});
         return user.profile.firstName + " " + user.profile.lastName;
     },
     taskName: () => {
         return tasks.findOne({_id: Template.instance().taskId}).name;
     },
     results: () => {

        const taskId = Template.instance().taskId;
        const userId = Template.instance().userId;
        var userTask = usertask.findOne({'taskId': taskId, 'userId': userId});
        tasks.findOne({_id: taskId}).steps.forEach(function (element) {
            if(userTask.progress) {
                userTask.progress.forEach(function (result) {
                    if (result.stepId == element._id)
                        result.name = element.name;
                });
            }
        });
        return userTask.progress;
    },
    url: (id) => {
        return Meteor.absoluteUrl() + 'admin/tasks/' + Template.instance().taskId + '/results/' + Template.instance().userId + '?p=' + id;
    },
    image: (result) => {
        var image = Images.findOne({_id: result});
        return '<a href="'+image.link()+'" class="showImage" id="' + result + '">Image</a>';
    },
    isImage: (completionType) => {
        if(completionType == 'Image')
            return true;
        else
            return false;
    }
});

Template.Results.events({
    'click .showImage': (event, tmpl) => {
        event.preventDefault();
        imageToShow.set(event.target.id);
        Modal.show('imageModal');
    },
    'click .remove-submission': (event)=> {
        Meteor.call('usertask.remove-progress', Template.instance().taskId, $(event.target).data('progressid'), Template.instance().userId);
    },
    'click .set-checked': (event) => {
        Meteor.call('usertask.set-checked', $(event.target).data('progressid'));
    },
    'click .showResult': (event) => {
        FlowRouter.setParams({progressId: $(event.target).data('progressid')});
        Modal.show('ResultModal');
    }

});

Template.imageModal.helpers({
    imageFile: function () {
        return Images.findOne({_id: imageToShow.get()});
    },
});

