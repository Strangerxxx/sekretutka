notifications = new Mongo.Collection('notifications');

notifications.allow({
    insert: function (userId) {
        return !!userId;
    },
    remove: function (userId) {
        if(Roles.userIsInRole(userId, 'admin'))
            return !!userId;
    },
    update: function (userId) {
        if(Roles.userIsInRole(userId, 'admin'))
            return !!userId;
    }
});

NotificationsSchema = new SimpleSchema({
    text: {
       type: String,
    },
    seen: {
        type: Boolean,
        autoValue: function () {
            if(!this.isSet)
                return false;
        }
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if(this.isInsert)
                return new Date();
        }
    }
});

Meteor.methods({
    'notifications.create': () => {
        notifications.insert({text: 'test notification!'});
    },
    'notifications.mark-seen':(_id) => {
        notifications.update({_id: _id}, {$set: {seen: true}});
    },
    'notifications.remove': (_id) => {
        notifications.remove({_id: _id});
    }
});

notifications.attachSchema(NotificationsSchema);