Template.EditUser.onCreated(function () {
    var self = this;
    self.subscribe('users', Meteor.userId());
});

Template.EditUser.helpers({
    user: () => {
        return Meteor.users.findOne({_id: FlowRouter.getParam('userId')});
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

