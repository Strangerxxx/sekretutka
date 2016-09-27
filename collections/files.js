this.Images = new Meteor.Files({
    debug: true,
    collectionName: 'Images',
    allowClientCode: false,
    onBeforeUpload: function (file) {
        if (file.size <= 1024*1024*10 && /png|jpg|jpeg/i.test(file.extension)) {
            return true;
        } else {
            return 'Please upload image, with size equal or less than 10MB';
        }
    }
});

