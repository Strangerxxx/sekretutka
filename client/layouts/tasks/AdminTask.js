Meteor.subscribe('tasks');
Meteor.subscribe('users');
Meteor.subscribe('usertask', Meteor.userId());

var editMode = new ReactiveVar();
editMode.set(false);

Template.AdminTask.helpers({
    users: ()=> {
        return Meteor.users.find();
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
                if (element.stepId == stepId)
                    result = element.result;
            });
            if(result.search(/.jpg/i)!= -1)
                result = '<a href="/.uploads/' + result + '">Image</a>';
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
    thisTask: (par)=> {
        return tasks.findOne(par);
    }
});

Template.AdminTask.events({
    'click .delete-task': function () {
        tasks.remove(this._id);
        Meteor.call('usertask.removeTask', this._id); //delete all connections with users from usertask
    },
    'submit .attach-users': function (event, tmpl) {
        event.preventDefault();
        var email = tmpl.find('.form-select :selected').text;
        user = Meteor.users.find({ "emails.address" : email }).fetch();
        Meteor.call('usertask.add', this._id, user[0]._id);
    },
    'click .delete-user': function (event) {
        Meteor.call('usertask.remove', $(event.target).data('task'), $(event.target).data('user'));
    },
    'change .enableEdit': ()=> {
        editMode.set(!editMode.get());
    }
});