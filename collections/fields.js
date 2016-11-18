fields = new Meteor.Collection('fields');

Meteor.methods({
    'fields.insert': (field) => {
        fields.insert(field);
    },
});

FieldsSchema = new SimpleSchema({
     name: {
         type: String,

     },
     displayName: {
         type: String,
     }
});

fields.attachSchema(FieldsSchema);