Schema = {};

Meteor.users.allow({
    update: (userId) => {
        if(Roles.userIsInRole(userId , 'admin'))
            return !!userId;
    }
});

Schema.UserProfile = new SimpleSchema({
    nickname: {
        type: String,
        label: 'Nickname',
        optional: true
    },
    firstName: {
        type: String,
        label: "First Name",
        optional: true
    },
    lastName: {
        type: String,
        optional: true
    },
    birthday: {
        type: Date,
        optional: true
    },
    gender: {
        type: String,
        allowedValues: ['Male', 'Female'],
        optional: true
    },
    invite: {
        type: String,
        unique: true
    }
});

Schema.User = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true,
        autoform: {
            type: 'hidden'
        }
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true,
        autoform: {
            type: 'hidden'
        }
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    },
    "emails.$.verified": {
        type: Boolean
    },
    // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
    registered_emails: {
        type: Array,
        optional: true,
        autoform: {
            type: 'hidden'
        }
    },
    'registered_emails.$': {
        type: Object,
        blackbox: true
    },
    createdAt: {
        type: Date,
        autoform: {
            type: 'hidden'
        }
    },
    profile: {
        type: Schema.UserProfile,
        optional: true
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true,
        autoform: {
            type: 'hidden'
        }
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    // roles: {
    //     type: Object,
    //     optional: true,
    //     blackbox: true
    // },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: Array,
        optional: true,
        autoform: {
            type: 'hidden'
        }
    },
    'roles.$': {
        type: String
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true,
        autoform: {
            type: 'hidden'
        }
    }
});

Schema.newUser = new SimpleSchema({
    email: {
        type: String,
        regEx: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    },
    password: {
        type: String
    },
    profile: {
        type: Schema.UserProfile
    }
});

Meteor.users.attachSchema(Schema.User);

Meteor.methods({
    'users.create': (doc) => {
        check(doc, Schema.newUser);
        var userId = Accounts.createUser({
            email: doc.email,
            password: doc.password,
            profile: doc.profile
        });
        // if(userId === undefined) throw new Meteor.Error(403, 'Access denied!');
        var stampedLoginToken = Accounts._generateStampedLoginToken();
        Accounts._insertLoginToken(userId, stampedLoginToken);
        return stampedLoginToken.token;
    },
    'users.count': function () {
        count = Meteor.users.find().fetch().length;
        return count;
    },
    'users.delete': function (userId) {
        Meteor.users.remove({_id: userId});
    }
});