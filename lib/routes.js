FlowRouter.route('/', {
    name: 'user',
    action() {
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

FlowRouter.route('/admin/tasks',{
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