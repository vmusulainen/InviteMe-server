import { Invites } from "../invites";

Meteor.publish("invites", function () {
    return Invites.find({}, {limit: 10, sort: {createdAt: -1}});
});