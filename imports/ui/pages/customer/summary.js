import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import Chart from "chart";


import "./summary.html";


Template.customerSummary.onCreated(function () {
    Chart.defaults.global.elements.rectangle.backgroundColor = "rgba(54, 162, 235, 0.2)";
    Chart.defaults.global.elements.rectangle.borderColor = "rgba(54, 162, 235, 1)";
    Chart.defaults.global.elements.rectangle.borderWidth = 1;

    this.updateInviteSTatistics = () => {
        Meteor.call("customerTheLastInvites", (err, data) => {
            if (err == null) {
                let maxValue = data.reduce((max, each) => {
                    return Math.max(max, each.count)
                }, 0);
                let stepSize = Math.ceil(maxValue / 10);
                this.theLastInviteChart.options.scales.yAxes[0].ticks.stepSize = stepSize === 0 ? 10 : stepSize;
                this.theLastInviteChart.options.scales.yAxes[0].ticks.max = Math.round(maxValue * 1.5);

                this.theLastInviteChart.data.labels = [];
                this.theLastInviteChart.data.datasets[0].data = [];

                data.forEach((each) => {
                    this.theLastInviteChart.data.labels.push(each._id);
                    this.theLastInviteChart.data.datasets[0].data.push(each.count);
                });

                this.theLastInviteChart.update();
            }
        });
    };

});

Template.customerSummary.helpers({});

Template.customerSummary.onRendered(function () {

    let ctx = document.getElementById("myChart");
    this.theLastInviteChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{label: "The last invites per day", data: []}]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 0.1
                    }
                }]
            }
        }
    });

    this.updateInviteSTatistics();
});

Template.customerSummary.events({
    "click [data-role=theLastInviteStatisticsUpdate]" (event, blazeTemplate){
        blazeTemplate.updateInviteSTatistics();
    }
});