Template.registerHelper('formatDate', (date) => moment(date).format('MMMM Do YYYY, HH:mm'));

Template.registerHelper('formatDateRelative', (date) => {
    Session.get('time');
    return moment(date).fromNow();
});

setInterval(function() {
    Session.set("time", new Date())
}, 10000);

Accounts.config({
    forbidClientAccountCreation: true
});

Toast.options = {
    closeButton: false,
    positionClass: "toast-top-right",
    showMethod: 'slideDown',
    timeOut: 2000,
};
AutoForm.debug();

Template.registerHelper('getVariablesFromText', (text) => {
    const regEx = /&lt;v&gt;(.+?)&lt;\/v&gt;/g;
    let matches, variables = {};

    while (matches = regEx.exec(text)) {
        let obj = {'name': matches[1], 'stepId': 'task'};
        variables[matches[1]] = null;
    }
    return variables;
});

Template.registerHelper('getVariablesFromTask', (task) => {
    const regEx = /&lt;v&gt;(.+?)&lt;\/v&gt;/g;
    let matches, variables = {};

    while (matches = regEx.exec(task.description)) {
        variables[matches[1]] = null;
    }

    for(const element of task.steps){
        while (matches = regEx.exec(element.description)) {
            variables[matches[1]] = null;
        }
    }
    return variables;
});

SimpleSchema.messages({
    regEx: [
        {msg: "Please enter a valid [label]"},
    ]
});