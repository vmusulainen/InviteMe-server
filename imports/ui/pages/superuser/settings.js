import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import { Settings } from "/imports/api/settings/settings";

import "./settings.html";

Template.superuserSettings.onCreated(function () {
    this.subscribe("allSettings");
});

Template.superuserSettings.helpers({
    reinviteTime() {
        return Settings.findOne({type: "publicSettings"}).reinviteTime;
    },
    fcmWebApiKey() {
        return Settings.findOne({type: "serverSettings"}).fcmWebApiKey;
    },
    inviteRange() {
        return Settings.findOne({type: "publicSettings"}).inviteRange;
    }
});

Template.superuserSettings.events({
    "submit": (event, blazeTemplate) => {
        event.preventDefault();
        let token = blazeTemplate.$("#fcmWebApiKey").val();
        console.log("token", token);
        let reinviteTime = parseInt(blazeTemplate.$("#reinviteTime").val());
        let inviteRange = parseInt(blazeTemplate.$("#inviteRange").val());
        Meteor.call("updateServerSettings", {
            fcmWebApiKey: token,
            reinviteTime: reinviteTime,
            inviteRange: inviteRange
        });
    }
});