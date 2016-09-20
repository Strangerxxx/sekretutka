Meteor.subscribe('tasks');
Meteor.subscribe('dictionary');
Meteor.subscribe('usertask');


Template.Task.helpers({
   users: ()=> {
       return Meteor.users.find();
   },
   user: ()=> {
       var id = Template.currentData()._id;
       var dict = usertask.find({"taskId": id}).map(function (doc) {
           return doc.userId;
       });
       return Meteor.users.find({_id: {$in: dict}});
   },
    step: (par)=> {
        var Step = null;
        var userTask = usertask.findOne({'userId' : Meteor.userId(), 'taskId': par});
        var task = tasks.findOne({'_id': par});
        task['steps'].forEach( function (element) {
            if(element._id == userTask['activeStepId'])
                Step = element;
        });
        return Step;
    },
    userInput: (par, _id)=> {
        switch(par){
            case 'Text':
                return  '<form class="completion-text" data-id="'+_id+'">' +
                            '<input type="text" name="text" class="completionString">' +
                            '<input type="submit" value="Submit">' +
                        '</form>';
                break;
            case 'Button':
                return '<input type="button" class="completion-button" value="Next">';
                break;
            case 'Image':
                return 'tbd';
            default:
                break;
        }
    },
    progress: (taskId, stepId)=>{
        var utArray = usertask.find({'taskId': taskId, 'progress': {$elemMatch: {stepId: stepId}}}).fetch();
        var users = [];
        utArray.forEach(function (element) {
            users.push(element.userId);
        });
        var emails = [];
        users.forEach(function (element) {
            emails.push(Meteor.users.findOne({_id: element}).emails[0].address);
        });
        var result = '';
        var data = [];
        for(var i=0; i<utArray.length; i++){
            utArray[i].progress.forEach(function (element) {
                if(element.stepId == stepId)
                    result = element.result;
            });
            data.push({
                email: emails[i],
                result: result
            });
        }
        console.log(utArray.length)
        return data;
    }

});

Template.Task.events({
    'click .delete-task': function () {
        tasks.remove(this._id);
        Meteor.call('usertask.removeTask', this._id); //delete all connections with users from usertask
    },
    'submit .attach-users': function (event, tmpl) {
        event.preventDefault();
        var email = tmpl.find('.form-select :selected').text;
        user = Meteor.users.find({ "emails.address" : email }).fetch();
        Meteor.call('usertask.add', this._id, user[0]._id);
    },
    'click .delete-user': function (event) {
        Meteor.call('usertask.remove', $(event.target).data('task'), $(event.target).data('user'));
    },
    'submit.completion-text': function (event, tmpl) {
        event.preventDefault();
        Meteor.call('usertask.progress', $(event.target).data('id'), event.target.text.value);
        event.target.text.value = '';
    }
});

Template.Tasks.helpers({
    tasks: ()=> {
        if(Roles.userIsInRole(Meteor.userId(), 'admin'))
        {
            return tasks.find();
        }
        else {
            var dict = usertask.find({"userId": Meteor.userId()}).map(function (doc) {
                return doc.taskId;
            });
            return tasks.find({_id: {$in: dict}});
        }
    },
});