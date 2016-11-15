Template.AddTask.onCreated(function () {
    Meteor.subscribe('tasks', Meteor.userId());
    Meteor.subscribe('files');
});

let hooksObject = {
    after: {
        insert: (error, id) => {
            let variables = Blaze._globalHelpers.getVariablesFromTask(tasks.findOne({_id: id}));
            for(let variable in variables){
                if(variables.hasOwnProperty(variable)){

                }
            }
        }
    }
};

AutoForm.hooks({
    insertTaskForm: hooksObject
});