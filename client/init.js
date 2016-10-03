Template.registerHelper( 'formatDate', (date) => moment(date).format('MMMM Do YYYY, HH:mm'));

Toast.options = {
    closeButton: false,
    positionClass: "toast-top-right",
    showMethod: 'slideDown',
    timeOut: 1200,
};