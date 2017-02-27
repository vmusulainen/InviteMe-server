import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Accounts } from 'meteor/accounts-base'


import "./setPassword.html";

Template.setPassword.onCreated(function () {
    this.password = new ReactiveVar("");
    this.repeatPassword = new ReactiveVar("");
});

Template.setPassword.helpers({});

Template.setPassword.events({
    "keyup #inputPassword": (event, blazeTemplate) => {
        let value = event.target.value.trim();
        blazeTemplate.password.set(value);
    },

    "keyup #inputRepeatPassword": (event, blazeTemplate) => {
        let value = event.target.value.trim();
        blazeTemplate.repeatPassword.set(value);
    },

    "click [data-role=setPassword]": (event, blazeTemplate) => {
        let toasts = [];
        let password = blazeTemplate.password.get();
        let repeatPassword = blazeTemplate.repeatPassword.get();

        if (password.trim().length === 0) {
            toasts.push("Password cannot be empty");
        }

        if (password !== repeatPassword) {
            toasts.push("Password and repeat password don't match");
        }

        if (toasts.length !== 0) {
            toasts.forEach((each) => {
                toastr["warning"](each);
            });
            return;
        }

        let token = FlowRouter.getParam("token");
        Accounts.resetPassword(token, password, (error) => {
            if (error != null) {
                toastr["error"](error.reason);
            } else {
                let path = FlowRouter.path("userMain", {id: Meteor.userId()});
                FlowRouter.go(path);
            }
        });
    }
});