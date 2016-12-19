Meteor.publish('tasks', function (userId) {
    if(Roles.userIsInRole(userId, 'admin'))
        return tasks.find({});
    else if(userId) {
        return tasks.find({
            "_id": {
                "$in": usertask.find({userId: userId}).fetch().map(function (element) {
                    return element.taskId;
                })
            }
        });
    }
});

Meteor.publish("users", function (userId) {
    let query;
    if(Roles.userIsInRole(userId, 'root'))
        query = {};
    else if(Roles.userIsInRole(userId, 'admin'))
        query = {roles: {$nin: ['admin']}};
    else
        query = {_id: userId};
    return Meteor.users.find(query, {fields: {emails: 1, profile: 1, createdAt: 1}});
});

Meteor.publish('usertask', function (userId) {
    if(Roles.userIsInRole(userId, 'admin'))
        return usertask.find({});
    else if(userId)
        return usertask.find({userId: userId});
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
Meteor.publish('variables', function () {
   return variables.find();
});
Meteor.publish('fields', function () {
    return fields.find();
});