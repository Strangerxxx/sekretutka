Template.Fields.helpers({
    fields: () => fields.find(),
});

Template.Fields.events({
    'click .add-field': () => {
        Modal.show('NewFieldModal');
    },
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
    },
    'click .delete-field': (event) => {
        let field = fields.findOne({_id: $(event.target).data('id')});
        if(!field)
            return;
        bootbox.confirm({
            title: 'Confirmation',
            message: "Deleting a field is an experimental and unfinished feature. Only use if You know what You are doing! Otherwise, click cancel.",
            size: 'small',
            buttons: {
                confirm: {
                    label: 'Delete',
                    className: 'btn-danger'

                },
                cancel: {
                    label: 'Cancel',
                    className: 'btn'
                }
            },
            callback: function (result) {
                if(result)
                    Meteor.call('fields.remove', field._id);
            }
        });
    },
});

Template.NewFieldModal.events({
    'submit #fieldForm': (event) => {
        event.preventDefault();
        let name = $('input.field-name').val();
        let displayName = $('input.field-displayName').val();
        let regExGlobal = /global\s(.*)/;
        let match;

        if(!regExGlobal.exec(name)){
            name = 'global ' + name;
        }
        if(fields.findOne({name: name}))
        {
            Toast.error('Field with name "' + name + '" already exists');
            return;
        }
        Meteor.call('fields.insert', {
            name: name,
            displayName: displayName
        });
        Modal.hide('NewFieldModal');
    }
});