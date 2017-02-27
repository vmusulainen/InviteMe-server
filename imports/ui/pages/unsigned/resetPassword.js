import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Accounts } from 'meteor/accounts-base'


import "./resetPassword.html";

Template.resetPassword.onCreated(function () {
    this.email = new ReactiveVar("");
});

Template.resetPassword.helpers({});

Template.resetPassword.events({
    "keyup #inputEmail": (event, blazeTemplate) => {
        let value = event.target.value.trim();
        blazeTemplate.email.set(value);
    },

    "click [data-role=resetPassword]": (event, blazeTemplate) => {
        let toasts = [];
        let email = blazeTemplate.email.get();

        if (email.trim().length === 0) {
            toasts.push("Email address cannot be empty");
        }

        if (toasts.length !== 0) {
            toasts.forEach((each) => {
                toastr["warning"](each);
            });
            return;
        }

        Accounts.forgotPassword({email: email}, (error) => {
            if (error != null) {
                toastr["error"](error.reason);
            } else {
                toastr["info"](`Email with link for password resetting has been sent to ${email} .`);
                FlowRouter.go("/");
            }
        });
    }
});