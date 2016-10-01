Meteor.subscribe('tasks');
Meteor.subscribe('users');
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
        var email = tmpl.find('.user-selected :selected').text;
        user = Meteor.users.find({ "emails.address" : email }).fetch();
        Meteor.call('usertask.add', this._id, user[0]._id);
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



Template.imageModal.events({

});