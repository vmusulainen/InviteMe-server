import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import "./devices.html";

import { Devices } from "/imports/api/devices/devices";

Template.superuserDevices.onCreated(function () {
    this.subscribe("devices");
});

Template.superuserDevices.helpers({
    devices() {
        return Devices.find();
    },
    actualDate(aDevice) {
        let datetime;
        if (aDevice.location != null) {
            datetime = aDevice.location.updatedAtServerTimestamp;
        } else {
            if (aDevice.updatedAt != null) {
                datetime = aDevice.location.updatedAt;
            } else {
                datetime = aDevice.location.createdAt;
            }
        }
        return `${datetime.toLocaleDateString()} ${datetime.toLocaleTimeString()}`;
    }
});


Template.superuserDevices.events({
    "click [data-role=centerOnPoint]": (event, blazeTemplate) => {
        let value = $(event.currentTarget).attr("data-coordinates");
        let lon = value.substring(0, value.indexOf(","));
        let lat = value.substring(value.indexOf(",") + 1);
        Map.setView([lat, lon], 16, {animate: true})
    },
    "click [data-role=remove]": (event, blazeTemplate) => {
        let value = $(event.currentTarget).attr("data-id");
        let device = Devices.findOne({_id: value});
        swal({
            title: "Are you sure?",
            text: `Removing device ${device.uuid}, ${device.model}, ${device.platform}`,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, remove it!",
            closeOnConfirm: true
        }, () => {
            Meteor.call("removeDevice", value);
        });
    },
    "click [data-role=clear]": (event, blazeTemplate) => {
        let value = $(event.currentTarget).attr("data-id");
        let device = Devices.findOne({_id: value});
        swal({
            title: "Are you sure?",
            text: `Clear invites history for device ${device.uuid}, ${device.model}, ${device.platform}`,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        }, () => {
            Meteor.call("clearInvitesForDevice", value);
        });
    }
});