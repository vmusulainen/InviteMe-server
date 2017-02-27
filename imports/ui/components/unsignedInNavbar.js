import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import "./unsignedInNavbar.html";

Template.unsignedInNavbar.onCreated(function () {
    this.currentPath = new ReactiveVar();
    Tracker.autorun(() => {
        FlowRouter.watchPathChange();
        this.currentPath.set(FlowRouter.current().path);

    });
});

Template.unsignedInNavbar.helpers({
    classForPath(aString){
        return aString === Template.instance().currentPath.get() ? "active" : "";
    }
});

Template.unsignedInNavbar.events({
    "click [data-role=signUp]": (event, blazeTemplate) => {
        FlowRouter.go("/signUp")
    }
});