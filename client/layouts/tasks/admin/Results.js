Template.Results.onCreated(function () {
    Meteor.subscribe('usertask');
    Meteor.subscribe('tasks');
    Meteor.subscribe('users', Meteor.userId());
    Template.instance().taskId = FlowRouter.getParam('taskId');
    Template.instance().userId = FlowRouter.getParam('userId');

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
        Meteor.call('usertask.remove-progress', Template.instance().taskId, $(event.target).data('stepid'));
    },
});

Template.imageModal.helpers({
    imageFile: function () {
        return Images.findOne({_id: imageToShow.get()});
    },
});