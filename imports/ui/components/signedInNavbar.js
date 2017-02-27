import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import "./signedInNavbar.html";

Template.signedInNavbar.onCreated(function () {
    this.isSuperuser = new ReactiveVar();
    Meteor.call("isSuperuser", (error, data)=> {
        if (error == null) {
            this.isSuperuser.set(data);
        }
    });
    this.currentPath = new ReactiveVar();
    Tracker.autorun(() => {
        FlowRouter.watchPathChange();
        this.currentPath.set(FlowRouter.current().path);

    });
});

Template.signedInNavbar.helpers({
    classForPath(aString){
        return aString === Template.instance().currentPath.get() ? "active" : "";
    },
    isReady(){
        let isReady = Template.instance().subscriptionsReady() && (Template.instance().isSuperuser.get() != null);
        return isReady;
    },
    isSuperuser(){
        return Template.instance().isSuperuser.get();
    }
});

Template.signedInNavbar.events({
    "click [data-role=signOut]": (event, blazeTemplate) => {
        Meteor.logout(() => {
            FlowRouter.go("/")
        })
    }
});