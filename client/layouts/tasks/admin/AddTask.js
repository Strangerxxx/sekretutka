Template.AddTask.onCreated(function () {
    Meteor.subscribe('tasks', Meteor.userId());
    Meteor.subscribe('files');
});

let hooksObject = {
    after: {
        insert: (error, id) => {
            let regEx = /global\s(.*)/;
            let match, matches = [];
            let variables = Blaze._globalHelpers.getVariablesFromTask(tasks.findOne({_id: id}));
            for(let variable in variables){
                if(variables.hasOwnProperty(variable)){
                    if(match = regEx.exec(variable)){
                        matches.push({
                            name: variable,
                        });
                    }
                }
            }
            if(matches.length != 0){
                Modal.show('globalVariablesModal', {matches: matches}, {
                    backdrop: 'static',
                    keyboard: false
                });
            }
        }
    }
};

AutoForm.hooks({
    insertTaskForm: hooksObject
});

Template.globalVariablesModal.events({
    'submit .globalVarForm': (event) => {
        event.preventDefault();
        Modal.hide('globalVariablesModal');
        let variables = Template.instance().data.matches;
        let output = [];
        console.log(Template.instance().data.matches, variables)

        for(let variable of variables){
            let value = $(`[name="${variable.name}"]`).val();
            output.push({
                name: variable.name,
                displayName: value,
            });
        }

        Meteor.call('fields.insert.many', output);
        Toast.success('Task created successfully');
    }
});