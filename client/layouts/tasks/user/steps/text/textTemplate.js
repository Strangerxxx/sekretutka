Template.textTemplate.events({
    'submit .completion-text': function (event, tmpl) {
        event.preventDefault();
        if(event.target.text.value){
            Meteor.call('usertask.progress', event.target.id, event.target.text.value);
            event.target.text.value = '';
        }
        else
            Toast.warning('Message is empty');
    },
});