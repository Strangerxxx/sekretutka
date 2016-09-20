Meteor.publish('tasks', function () {
    return tasks.find({});
});
Meteor.publish("directory", function () {
    return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});
Meteor.publish('usertask', function () {
    return usertask.find({});
});
Meteor.publish(null, function (){
    return Meteor.roles.find({})
})
