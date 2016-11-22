Template.Fields.helpers({
    fields: () => fields.find(),
});

Template.Fields.events({
    'click .edit-field': (event)=> {
        let field = fields.findOne({_id: $(event.target).data('id')});
        if(field)
            bootbox.prompt({
                title: "Edit " + field.name + " display name",
                value: field.displayName,
                callback: function (result) {
                    if(!result)
                        return;
                    Meteor.call('fields.edit', field._id, result, function (error, result) {
                        if(error)
                            Toast.error(error.message);
                        else
                            Toast.success('Field ' + field.name + ' was edited successfully.');
                    })
                }
            });
    }
});