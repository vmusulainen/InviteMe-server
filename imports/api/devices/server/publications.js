import { Devices } from "../devices.js";

Meteor.publish("devices", function () {
    return Devices.find();
});