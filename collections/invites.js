invites2 = new Mongo.Collection('invites2');

invites2.allow({
    insert: function (userId) {
        if(Roles.userIsInRole(userId, 'admin'))
            return !!userId;
    },
    remove: function (userId) {
        if(Roles.userIsInRole(userId, 'admin'))
            return !!userId;
    },
    update: function (userId) {
        return !!userId;
    }
});

Meteor.methods({
    'invites.create'(userId){
        if (Roles.userIsInRole(userId, 'admin'))
            invites2.insert({});
    },
    'invites.delete'(userId, token){
        if(Roles.userIsInRole(userId, 'admin'))
            invites2.remove({_id: token});
    },
    'invites.set-visited'(token){
        if(!(invites2.findOne({_id: token}).status == 'claimed'))
            invites2.update({_id: token}, {$set: {status: 'visited'}});
    },
    'invites.set-claimed'(token){
        invites2.update({_id: token}, {$set: {status: 'claimed'}});
    }
});

InvitesSchema = new SimpleSchema({
    status: {
       type: String,
       allowedValues: ['invited', 'visited', 'claimed'],
       autoValue: function () {
           if(!this.isSet)
               return 'invited';
       }
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    }
});

invites2.attachSchema(InvitesSchema);