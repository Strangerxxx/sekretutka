Template.registerHelper( 'formatDate', (date) => {
    return moment(date).format('MMMM do YYYY, HH:mm');
});

Toast.options = {
    closeButton: false,
    positionClass: "toast-top-right",
    showMethod: 'slideDown',
    timeOut: 1200,
};