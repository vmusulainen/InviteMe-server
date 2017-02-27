import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Accounts } from 'meteor/accounts-base'

import "./signUp.html";

Template.signUp.onCreated(function () {
    this.username = new ReactiveVar("");
    this.email = new ReactiveVar("");
    this.password = new ReactiveVar("");
    this.repeatPassword = new ReactiveVar("");
});

Template.signUp.helpers({});

Template.signUp.events({
    "keyup #inputUsername": (event, blazeTemplate) => {
        let value = event.target.value.trim();
        blazeTemplate.username.set(value);
    },

    "keyup #inputEmail": (event, blazeTemplate) => {
        let value = event.target.value.trim();
        blazeTemplate.email.set(value);
    },

    "keyup #inputPassword": (event, blazeTemplate) => {
        let value = event.target.value.trim();
        blazeTemplate.password.set(value);
    },

    "keyup #inputRepeatPassword": (event, blazeTemplate) => {
        let value = event.target.value.trim();
        blazeTemplate.repeatPassword.set(value);
    },

    "submit": (event, blazeTemplate) => {
        event.preventDefault();
        let toasts = [];
        let username = blazeTemplate.username.get();
        let email = blazeTemplate.email.get();
        let password = blazeTemplate.password.get();
        let repeatPassword = blazeTemplate.repeatPassword.get();

        if (username.trim().length === 0) {
            toasts.push("Username cannot be empty");
        }

        if (email.trim().length === 0) {
            toasts.push("Email cannot be empty");
        }

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

        Meteor.call("createCustomer", {username: username, email: email, password: password}, (error, result) => {
            if (error != null) {
                toastr["error"](error.reason);
            } else {
                FlowRouter.go("emailVerification");
            }
        });
    }
});