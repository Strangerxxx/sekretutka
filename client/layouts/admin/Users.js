Meteor.subscribe('directory');
Meteor.subscribe('usertask');
Meteor.subscribe('tasks');

var email = new ReactiveVar();

Template.body.onCreated(function bodyOnCreated() {

});

Template.Users.helpers({
    users: ()=> {
        return Meteor.users.find();
    },
});

Template.Users.events({
   'change .selUser': (event) => {
       email.set(event.target.value);
   }
});

Template.User.helpers({
    _id() {
        return email.get();
    },
    tasks: ()=> {

        var task = usertask.find({'userId' : email.get()}).map(function (doc) {
            return doc.taskId;
        });

        return tasks.find({_id: {$in: task}});
    }
});