import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import "./signIn.css";
import "./signIn.html";

Template.signIn.onCreated(function () {
});

Template.signIn.helpers({});

Template.signIn.events({
    "submit": (event, blazeTemplate) => {
        event.preventDefault();
        let username = blazeTemplate.$("#inputUsername").val();
        let password = blazeTemplate.$("#inputPassword").val();
        console.log(username, password);
        Meteor.loginWithPassword(username, password, (error) => {
            console.log("loginWithPassword", error);
            if (error != null) {
                toastr["error"](error.reason);
            }
            else {
                console.log("before isSuperuser");
                Meteor.call("isSuperuser", (error, result) => {
                    console.log("isSuperuser", error, result);
                    if (error != null) {
                    }
                    else {
                        let path;
                        if (result === true) {
                            path = FlowRouter.path("superuserSummary");
                        }
                        else {
                            path = FlowRouter.path("customerSummary", {id: Meteor.userId()});
                        }
                        console.log("path", path);
                        FlowRouter.go(path);
                    }
                });
            }
        });
    }
});