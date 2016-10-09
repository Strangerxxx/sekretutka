Template.registerHelper( 'formatDate', (date) => moment(date).format('MMMM Do YYYY, HH:mm'));

Accounts.config({
    forbidClientAccountCreation: true
});

Toast.options = {
    closeButton: false,
    positionClass: "toast-top-right",
    showMethod: 'slideDown',
    timeOut: 1200,
};
AutoForm.debug();