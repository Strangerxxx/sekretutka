Template.afFroala.rendered = function () {
    var options = this.data.atts;
    var $self = this.$('.froala');

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
