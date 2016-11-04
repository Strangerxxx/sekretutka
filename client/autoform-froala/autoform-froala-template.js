Template.afFroala.rendered = function () {
    var options = this.data.atts;
    console.log(options)
    var $self = this.$('.froala');

    // Define popup template.
    $.extend($.FroalaEditor.POPUP_TEMPLATES, {
        "customPlugin.popup": '[_CUSTOM_LAYER_]'
    });

    // The custom popup is defined inside a plugin (new or existing).
    $.FroalaEditor.PLUGINS.customPlugin = function (editor) {


        // Create custom popup.
        function initPopup () {

            // Load popup template.
            var template = {
                custom_layer:
                '<div class="fr-variable-insert-layer">' +
                    '<div class="fr-input-line">' +
                        '<input type="text" class="var-text" placeholder="Variable">' +
                    '</div>' +
                    '<div class="fr-action-buttons">' +
                        '<button type="button" class="fr-command fr-submit" data-cmd="insertVariable">Insert</button>' +
                    '</div>' +
                '</div>'
            };

            // Create popup.
            var $popup = editor.popups.create('customPlugin.popup', template);

            return $popup;
        }

        // Show the popup
        function showPopup () {
            // Get the popup object defined above.
            var $popup = editor.popups.get('customPlugin.popup');

            // If popup doesn't exist then create it.
            // To improve performance it is best to create the popup when it is first needed
            // and not when the editor is initialized.
            $popup = initPopup();

            // Set the editor toolbar as the popup's container.
            editor.popups.setContainer('customPlugin.popup', editor.$tb);

            // This will trigger the refresh event assigned to the popup.
            // editor.popups.refresh('customPlugin.popup');

            // This custom popup is opened by pressing a button from the editor's toolbar.
            // Get the button's object in order to place the popup relative to it.
            var $btn = editor.$tb.find('.fr-command[data-cmd="myButton"]');

            // Set the popup's position.
            var left = $btn.offset().left + $btn.outerWidth() / 2;
            var top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);

            // Show the custom popup.
            // The button's outerHeight is required in case the popup needs to be displayed above it.
            editor.popups.show('customPlugin.popup', left, top, $btn.outerHeight());
        }

        // Hide the custom popup.
        function hidePopup () {
            editor.popups.hide('customPlugin.popup');
        }

        // Methods visible outside the plugin.
        return {
            showPopup: showPopup,
            hidePopup: hidePopup
        }
    };

    // Define an icon and command for the button that opens the custom popup.
    $.FroalaEditor.DefineIcon('buttonIcon', { NAME: 'asterisk'});
    $.FroalaEditor.RegisterCommand('myButton', {
        title: 'Insert Variable',
        icon: 'buttonIcon',
        undo: false,
        focus: false,
        plugin: 'customPlugin',
        callback: function () {
            this.customPlugin.showPopup();
        }
    });

    $.FroalaEditor.RegisterCommand('insertVariable', {
        undo: true,
        callback: function (event) {
            console.log($(this).prev('input').attr('id'))
            let insert = '&lt;v&gt;' + $('.var-text').val() + '&lt;/v&gt;';
            this.html.insert(insert);
        }
    });

    $self.froalaEditor(options);
    $self.closest('form').on('reset', function () {
        $self.froalaEditor('setHTML', '', true);
    });
};

Template.afFroala.helpers({
    dataSchemaKey: function () {
        return this.atts['data-schema-key'];
    },

    remainingAtts: function () {
        var atts = JSON.parse(JSON.stringify(this.atts));

        delete atts['data-schema-key'];
        delete atts['class'];

        return atts;
    }
});
