import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";

import {Points} from "/imports/api/points/points";

import "./pointDialog.html";

Template.pointDialog.onCreated(function () {
    this.subscribe("userPoints");
});

Template.pointDialog.helpers({
    pointName(){
        return Template.instance().data.name;
    },
    pointAddress(){
        return Template.instance().data.address;
    },
    inviteText(){
        return Template.instance().data.invite;
    },
    inviteFrom(){
        return Template.instance().data.from;
    },
    inviteTo(){
        return Template.instance().data.to;
    },
    checked(){
        console.log("Template.instance().data.active", Template.instance().data.active);
        return Template.instance().data.active === true ? "checked" : null;
    }
});


Template.pointDialog.events({
    "click [data-role=cancel]"(event, blazeTemplate) {
    },
    "click [data-role=submit]"(event, blazeTemplate) {
        let point = blazeTemplate.data;
        point.userId = Meteor.userId();
        point.name = blazeTemplate.$("#name").val();
        point.address = blazeTemplate.$("#address").val();
        point.invite = blazeTemplate.$("#invite").val();
        point.from = blazeTemplate.$("#from").val();
        point.to = blazeTemplate.$("#to").val();
        point.active = blazeTemplate.$("#active").is(":checked");
        console.log(point);
        Meteor.call("upsertPoint", blazeTemplate.data, (error) => {
            if (error != null) {
                toastr["error"](error.reason);
            } else {
                Modal.hide("pointDialog");
            }
        });
    }
});