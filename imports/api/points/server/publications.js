import { Points } from "../points";

Meteor.publish("userPoints", function () {
    return Points.find({userId: this.userId});
});