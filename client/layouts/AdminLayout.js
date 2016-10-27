Template.AdminLayout.onCreated(function () {
   let init = false;
   let handle = Meteor.subscribe('notifications', function () {
      notifications.find({}).observe({
         added: function (doc) {
            if(init)
               Toast.success(doc.text);
            init = true;
         }
      });
   });
});

Template.Notifications.helpers({
   notification: () => {

      return notifications.find({}, { sort: {createdAt: -1}});
   },
   notifCount: () => {
      var count = notifications.find({seen: false}).count();
      if(count != 0)
         return count;
   },
});

Template.AdminLayout.events({
   'click .navbar-brand': () => {
      Meteor.call('notifications.create');
   },
   'mouseenter .notification-item': (event) => {
      Meteor.call('notifications.mark-seen', $(event.target).data('id'));
   },
   'click .remove-notification': (event) => {
      Meteor.call('notifications.remove', $(event.target).data('id'));
   },
   'click .dropdown-menu': (event) => {
      event.stopPropagation();
   }
});