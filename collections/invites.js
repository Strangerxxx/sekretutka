invites = new Mongo.Collection('invites');

invites.allow({
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
            invites.insert({});
    },
    'invites.delete'(userId, token){
        if(Roles.userIsInRole(userId, 'admin'))
            invites.remove({_id: token});
    },
    'invites.set-visited'(token){
        if(!(invites.findOne({_id: token}).status == 'claimed'))
            invites.update({_id: token}, {$set: {status: 'visited'}});
    },
    'invites.set-claimed'(token){
        invites.update({_id: token}, {$set: {status: 'claimed'}});
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

invites.attachSchema(InvitesSchema);