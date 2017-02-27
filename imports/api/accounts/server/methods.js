import {  Meteor } from "meteor/meteor";
import { check } from 'meteor/check'

Meteor.methods({
    "createCustomer": function (anObject) {
        check(anObject, {
            username: String,
            email: String,
            password: String
        });
        let userId = Accounts.createUser(anObject);
        Accounts.sendVerificationEmail(userId);
        Meteor.users.update(userId, {
            $set: {
                userType: "customer"
            }
        });
    },

    "isSuperuser": function () {
        let user = Meteor.users.findOne({_id: Meteor.userId()});
        return user.userType === "superuser";
    }
});
