Meteor.publish('tasks', function (userId) {
    if(Roles.userIsInRole(userId, 'admin'))
        return tasks.find({});

    var tasksIds  = usertask.find({userId: userId}).fetch().map(function (element) {
        return element.taskId;
    });

    return tasks.find({
        "_id": { "$in": tasksIds }
    });
});
Meteor.publish("users", function (userId) {
    if(Roles.userIsInRole(userId, 'admin'))
        return Meteor.users.find({}, {fields: {emails: 1, profile: 1, createdAt: 1}});
    else
        return Meteor.users.find({_id: userId}, {fields: {emails: 1, profile: 1, createdAt: 1}});
});
Meteor.publish('usertask', function (userId) {
    return usertask.find({});
});
Meteor.publish(null, function (){
    return Meteor.roles.find({});
});
Meteor.publish('files', function () {
    return Images.find({}).cursor;
});
Meteor.publish('invites', function (token, userId) {
    if(userId == null)
        return invites.find(token);
    else if(Roles.userIsInRole(userId, 'admin'))
        return invites.find();
});
Meteor.publish('notifications', function () {
   return notifications.find();
});