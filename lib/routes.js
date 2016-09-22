FlowRouter.route('/', {
    name: 'user',
    action() {
        if(Roles.userIsInRole(Meteor.userId(), 'admin')){
            FlowRouter.go('/admin');
        }
        else
            BlazeLayout.render('UserLayout');
    }
});

FlowRouter.route('/admin', {
    name: 'admin',
    action() {
        BlazeLayout.render('AdminLayout');
    }
});

FlowRouter.route('/admin/add',{
    name: 'addTask',
    action() {
        BlazeLayout.render('AdminLayout', {main: 'AddTask'})
    }
});

FlowRouter.route('/admin/list',{
    name: 'listTasks',
    action() {
        BlazeLayout.render('AdminLayout', {main: 'Tasks'})
    }
});

FlowRouter.route('/admin/users',{
    name: 'manageUsers',
    action() {
        BlazeLayout.render('AdminLayout', {main: 'Users'})
    }
});