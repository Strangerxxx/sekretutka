Template.AddTask.onCreated(function () {
    Meteor.subscribe('tasks', Meteor.userId());
    Meteor.subscribe('files');
});

let hooksObject = {
    after: {
        insert: (error, id) => {
            let regEx = /global\s(.*)/;
            let match;
            let variables = Blaze._globalHelpers.getVariablesFromTask(tasks.findOne({_id: id}));
            for(let variable in variables){
                if(variables.hasOwnProperty(variable)){
                    if(match = regEx.exec(variable)){
                        Meteor.call('fields.insert', {name: match[0]});
                    }
                }
            }
        }
    }
};

AutoForm.hooks({
    insertTaskForm: hooksObject
});