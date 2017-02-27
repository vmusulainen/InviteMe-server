import { Settings } from "../settings";

Meteor.publish("allSettings", function () {
    return Settings.find();
});

Meteor.publish("publicSettings", function () {
    return Settings.find({type: "publicSettings"});
});