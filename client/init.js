Template.registerHelper( 'formatDate', (date) => {
    return moment(date).format('MMMM do YYYY, HH:mm');
});