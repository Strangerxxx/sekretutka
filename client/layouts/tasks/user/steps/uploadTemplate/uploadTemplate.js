Template.uploadTemplate.onCreated(function () {
    this.currentUpload = new ReactiveVar(false);
});

Template.uploadTemplate.helpers({
    currentUpload: function () {
        return Template.instance().currentUpload.get();
    }
});

Template.uploadTemplate.events({
    'change .fileInput': function (event, template) {
        if(event.currentTarget.files && event.currentTarget.files[0]) {
            var file = event.currentTarget.files[0];

            if(file) {
                var uploadInstance = Images.insert({
                    file: file,
                    streams: 'dynamic',
                    chunkSize: 'dynamic',
                }, false);

                uploadInstance.on('start', function () {
                    template.currentUpload.set(this);
                });

                uploadInstance.on('end', function (error, fileObj) {
                    if(error)
                        alert('Error during upload' + error.reason);
                    else{
                        Meteor.call('usertask.progress', event.target.id, fileObj._id);
                        template.currentUpload.set(false);
                    }

                });

                uploadInstance.start();
            }
        }
    }
});