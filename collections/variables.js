variables = new Meteor.Collection('variables');

Meteor.methods({
   'variables.add': (_variables) => {
       for(variable of _variables)
            variables.insert(variable);
    }
});

Schema = {};

Schema.Variables = new SimpleSchema({
    name: {
        type: String,
    },
    value:{
        type: String,
        optional: true,
    },
    task:{
        type: tasks,
        optional: true,
    },
    user:{
        type: Meteor.users,
        optional: true,
    },
    subtype:{
        type: String,
        allowedValues: [
            'userReg',
            'adminDef',
            'userDef',
        ]
    },
});

variables.attachSchema(Schema.Variables);