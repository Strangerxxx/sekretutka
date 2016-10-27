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
    timeOut: 1200,
};
AutoForm.debug();

Template.registerHelper('getVariablesFromTask', (task) => {
    const regEx = /&lt;v&gt;(.+?)&lt;\/v&gt;/g;
    let matches, output = [];

    while (matches = regEx.exec(task.description)) {
        output.push({'name': matches[1]});
    }

    for(const element of task.steps){
        while (matches = regEx.exec(element.description)) {
            output.push({'name': matches[1]});
        }
    }
    return output;
});