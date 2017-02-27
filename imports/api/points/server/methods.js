import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import "./check-extensions";
import {Points} from "../points";
import {Invites} from "../../invites/invites";

Meteor.methods({
    "upsertPoint": (anObject) => {

        function hoursAndMinutesToNumber(aString) {
            var hours = parseInt(aString.slice(0, 2));
            var minutes = parseInt(aString.slice(3, 5));
            return hours + minutes / 60;
        }

        console.log(anObject);
        check(anObject, {
            _id: Match.Maybe(String),
            userId: Meteor.userId(),
            name: Match.NotEmptyString,
            address: Match.NotEmptyString,
            latitude: Number,
            longitude: Number,
            from: String,
            to: String,
            invite: Match.NotEmptyString,
            active: Boolean
        });

        let point = {};
        if (anObject._id != null) {
            point._id = anObject._id;
        }
        point.userId = Meteor.userId();
        point.name = anObject.name;
        point.address = anObject.address;
        point.invite = anObject.invite;
        point.from = anObject.from;
        point.fromNumber = hoursAndMinutesToNumber(anObject.from);
        point.to = anObject.to;
        point.toNumber = hoursAndMinutesToNumber(anObject.to);
        point.active = anObject.active;
        point.location = {
            coordinates: [anObject.longitude, anObject.latitude],
            type: "Point"
        };
        if (point._id == null) {
            Points.insert(point);
        }
        else {
            Points.update({_id: point._id}, point);
        }

    },

    "removePoint": (aString) => {
        check(aString, String);
        let point = Points.findOne({_id: aString});
        check(point.userId, Meteor.userId());
        Points.remove({_id: aString});
        Invites.remove({pointId: aString});
    }
});

/*
 var from = {};
 from.hours = parseInt(blazeTemplate.$("#from").val().slice(0, 2));
 from.minutes = parseInt(blazeTemplate.$("#from").val().slice(3, 5));
 var to = {};
 to.hours = parseInt(blazeTemplate.$("#to").val().slice(0, 2));
 to.minutes = parseInt(blazeTemplate.$("#to").val().slice(3, 5));
 */
