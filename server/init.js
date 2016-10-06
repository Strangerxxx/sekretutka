// AccountsInvite.register({
//     validateToken: validateToken,
//     onCreatedAccount: onCreatedAccount
// });

function validateToken(token){
    if(InvitesCollection.findOne({"token":token}) || !Meteor.users.findOne()) return true;
    else return false;
}

function onCreatedAccount(attemptingUser, attempt){
    InvitesCollection.update({"token":attemptingUser.services.accountsInvite.inviteToken}, {$set:{"status":"claimed"}});

}

