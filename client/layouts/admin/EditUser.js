Template.EditUser.onCreated(function () {
    this.subscribe('users', Meteor.userId());
});

Template.EditUser.helpers({
    user: () => {
        return Meteor.users.findOne({_id: FlowRouter.getParam('userId')});
    },
    globals: (id) => {
        return variables.find({user: id, task: null});
    },
    displayName: (name) => {
        return fields.findOne({name: name}).displayName;
    },
    admin: (id) => Roles.userIsInRole(id, 'admin'),
});

Template.EditUser.events({
    'click .submit-edit': () => {
        let vars = variables.find({user: FlowRouter.getParam('userId'), task: null}).fetch();
        if(!vars)
            return;

        for(let _var of vars){
            Meteor.call('variables.update.one', _var._id, $('input[name= ' + _var._id + ']').val());
        }
    }
});

var hooksObject = {
    before: {

    },

    after: {

    },

    onError: function (formType, error) {
        console.log(error);
    },

    onSuccess: function () {
        FlowRouter.go('/admin/users');
    }
};

AutoForm.hooks({
    updateUserForm: hooksObject
});

