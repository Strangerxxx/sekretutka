variables = new Meteor.Collection('variables');

Meteor.methods({
   'variables.add': (_variables) => {
       for(variable of _variables)
            variables.insert(variable);
    },
    'variables.add.one': (variable) => {
        variables.insert(variable);
    },
    'variables.removeTask': (taskId) => {
        variables.remove({task: taskId});
    },
    'variables.update': (taskId, userId, _variables) => {
        for(let _var in _variables){
            if(_variables.hasOwnProperty(_var))
                variables.update({task: taskId, user: userId, name: _var}, {$set: { value: _variables[_var] }});
        }
    },
    'variables.update.one': (id, value) => {
        variables.update({_id: id}, {$set: {value: value}});
    }
});

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
});

variables.attachSchema(Schema.Variables);