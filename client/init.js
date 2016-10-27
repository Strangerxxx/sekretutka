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

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (JSON.stringify(myArray[i]) === JSON.stringify(searchTerm)) return i;
    }
    return -1;
}

Array.prototype.pushUnique = function (item){
    if(arrayObjectIndexOf(this, item) == -1) {
        this.push(item);
        return true;
    }
    return false;
};

Template.registerHelper('getVariablesFromTask', (task) => {
    const regEx = /&lt;v&gt;(.+?)&lt;\/v&gt;/g;
    let matches, output = [];

    while (matches = regEx.exec(task.description)) {
        let obj = {'name': matches[1]};
        output.pushUnique(obj);
    }

    for(const element of task.steps){
        while (matches = regEx.exec(element.description)) {
            let obj = {'name': matches[1]};
            output.pushUnique(obj);
        }
    }
    return output;
});