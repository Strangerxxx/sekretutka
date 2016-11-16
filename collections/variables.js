variables = new Meteor.Collection('variables');

Meteor.methods({
   'variables.add': (_variables) => {
       for(variable of _variables)
            variables.insert(variable);
    },
    'variables.removeTask': (taskId) => {
        variables.remove({task: taskId});
    },
    'variables.update': (taskId, userId, _variables) => {
        for(let _var in _variables){
            console.log(_variables[_var])
            if(_variables.hasOwnProperty(_var))
                variables.update({task: taskId, user: userId, name: _var}, {$set: { value: _variables[_var] }});
        }
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