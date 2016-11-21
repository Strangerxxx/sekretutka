
Template.AcceptInvite.onCreated(function () {
    Template.instance().token = FlowRouter.getParam('token');
    var self = this;
    self.subscribe('users', Meteor.userId());
    self.subscribe('invites', Template.instance().token, Meteor.userId());
    this.subscribe('fields');
});


Template.AcceptInvite.helpers({
    claimed: () => {
        var invite = invites.findOne();
        if(invite) {
            Meteor.call('invites.set-visited', Template.instance().token);
            return !(invite.status == 'invited' || invite.status == 'visited');
        } else return true;
    },
    token: () => Template.instance().token,
    newUserSchema: () => {
        FieldsSchema = {};
        let _fields = fields.find().fetch();

        for(let field of _fields){
            FieldsSchema[field.name] = {
                type: String,
                label: field.displayName,
            }
        }

        Fields = new SimpleSchema({
            variables:{
                type: new SimpleSchema(FieldsSchema),
            }
        });
        return new SimpleSchema([Schema.newUser, Fields]);
    },
    variables: () => fields.find(),
});

AutoForm.hooks({
    register: {
        onSuccess: (formType, result) => {
            Accounts.loginWithToken(result);
            FlowRouter.redirect('/');
        }
    }
});
