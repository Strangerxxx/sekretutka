FlowRouter.route('/', {
    name: 'user',
    action() {
        BlazeLayout.render('UserLayout', {main: 'Tasks'});
    }
});

FlowRouter.route('/tasks/:taskId', {
   action() {
       BlazeLayout.render('UserLayout', {main: 'Tasks', sub: 'UserTask'});
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

FlowRouter.route('/admin/users/edit/:userId', {
   name: 'editUser',
    action() {
       BlazeLayout.render('AdminLayout', {main: 'EditUser'})
    }
});

FlowRouter.route('/admin/tasks/:taskId/', {
    action: function(params, queryParams) {
        BlazeLayout.render('AdminLayout', {main: 'AdminTask'}, {data: params.taskId});
    },
});

FlowRouter.route('/admin/tasks/:taskId/results/:userId', {
   action: function (params){
       BlazeLayout.render('AdminLayout', {main: 'Results'});
   }
});

FlowRouter.route('/acceptInvite/:token', {
    action: function(params){
        BlazeLayout.render('AcceptInvite');

    }
});