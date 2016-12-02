Template.MainStepTemplate.helpers({
    step : () => {
        let taskId = Template.instance().data;
        let userTask = usertask.findOne({'userId': Meteor.userId(), 'taskId': taskId});
        let task = tasks.findOne({'_id': taskId});
        if (userTask){
            if (userTask.progress == undefined)
                return task.steps[0];
            else {
                for (var i = 0; i < task['steps'].length; i++) {
                    for (var t = 0; t < userTask.progress.length; t++) {
                        if (task.steps[i]._id == userTask.progress[t].stepId && userTask.progress[t].ignored == false){
                            if(userTask.progress[t].checked == false) {
                                return {
                                    _id: task.steps[i]._id,
                                    name: task.steps[i].name,
                                    description: task.steps[i].description,
                                };
                            }
                            else
                                break;
                        }

                        if (t == (userTask.progress.length - 1))
                            return task.steps[i];
                    }
                }
            }
        }
        return { name: 'Completed'};
    },
    desc: (text) => {
        let userTask = usertask.findOne({taskId: FlowRouter.getParam('taskId')});
        let vars = variables.find({task: FlowRouter.getParam('taskId'), user: Meteor.userId()}).fetch();
        let globalVars = variables.find({task: null, user: Meteor.userId()}).fetch();

        const regEx = /&lt;v&gt;(.+?)&lt;\/v&gt;/g;
        let regExProfile = /profile\s(.*)/;
        let regExGlobal = /global\s(.*)/;
        let match;

        return text.replace(regEx, function(s, key) {
            if(match = regExProfile.exec(key))
                return Meteor.user().profile[match[1]];
            else if(match = regExGlobal.exec(key)){
                for(_var of globalVars)
                    if(_var.name == match[0])
                        return _var.value;
            }
            else{
                for(Var of vars){
                    if(Var.name == key)
                        return Var.value;
                }
            }
        });
    },
    completed: (name) =>{return name == 'Completed'},
    userInput: (par) => {
        switch(par){
            case 'Text':
                return 'textTemplate';
                break;
            case 'Button':
                return 'buttonTemplate';
                break;
            case 'Image':
                return 'uploadTemplate';
                break;
            default:
                break;
        }
    },
});