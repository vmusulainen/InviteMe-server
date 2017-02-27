import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import Chart from "chart";


import "./summary.html";


Template.superuserSummary.onCreated(function () {

});

Template.superuserSummary.helpers({
    inviteCount(){
        return 123;
    }

});

