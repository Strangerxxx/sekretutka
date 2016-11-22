fields = new Meteor.Collection('fields');

Meteor.methods({
    'fields.insert': (field) => {
        fields.insert(field);
    },
    'fields.insert.many': (_fields) => {
        for(let field of _fields)
            fields.insert(field);
    },
    'fields.edit': (_id, value) => {
        fields.update({_id: _id}, {$set: {displayName: value}});
    }
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