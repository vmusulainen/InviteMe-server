import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import { Points } from "/imports/api/points/points";
import { Settings } from "/imports/api/settings/settings";

import "./points.css"
import "./points.html";
import "./pointDialog";

Template.customerPoints.onCreated(function () {

    var pointIcon = L.icon({
        iconUrl: '/leaflet/images/coffee.png',
        iconSize: [32, 37], // size of the icon
        iconAnchor: [16, 37], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -30] // point from which the popup should open relative to the iconAnchor
    });

    this.markers = [];
    this.circles = [];
    this.inviteRange = new ReactiveVar(Meteor.settings.public.inviteRange);

    this.subscribe("userPoints", ()=> {
        Points.find().observe({
            added: this.onPointAdded,
            removed: this.onPointRemoved
        });
    });

    this.onPointAdded = (point) => {
        let lon = point.location.coordinates[0];
        let lat = point.location.coordinates[1];
        var marker = L.marker([lat, lon], {icon: pointIcon}).addTo(this.map);
        marker.point = point;
        this.markers.push(marker);


        marker.on("mouseover", (event) => {
            this.selectedPoint = event.target.point;
            let content = `<h4>${event.target.point.name}</h4><br/>${event.target.point.invite}`;
            let markerPopup = L.popup({closeButton: false}).setLatLng(marker.latlng).setContent(content);
            marker.bindPopup(markerPopup).openPopup();
        });


        marker.on("mouseout", (event) => {
            if (this.popupTimeoutId != null) {
                clearTimeout(this.popupTimeoutId);
            }
            this.popupTimeoutId = setTimeout(() => {
                this.selectedPoint = null;
                marker.closePopup();
            }, 5000);
        });


        let range = this.inviteRange.get();
        let circle = L.circle(marker.getLatLng(), range, {weight: 1}).addTo(this.map);
        circle.point = point;
        this.circles.push(circle);
    };
    this.onPointRemoved = (point) => {
        let layer = this.markers.find((each) => {
            return each.point._id === point._id;
        });
        let idx = this.markers.indexOf(layer);
        this.markers.splice(idx, 1);
        this.map.removeLayer(layer);

        layer = this.circles.find((each) => {
            return each.point._id === point._id;
        });
        idx = this.circles.indexOf(layer);
        this.circles.splice(idx, 1);
        this.map.removeLayer(layer);
    }

    this.subscribe("publicSettings", () => {
        Settings.find().observe({
            added: (doc) => {
                if (doc.type === "publicSettings") {
                    this.inviteRange.set(Settings.findOne().inviteRange);
                }
            },
            changed: (oldDoc, newDoc) => {
                if (newDoc.type === "publicSettings") {
                    this.inviteRange.set(Settings.findOne().inviteRange);
                }
            }
        });
    });

    Tracker.autorun(() => {
        let range = this.inviteRange.get();
        this.circles.forEach((each) => {
            this.map.removeLayer(each);
        });
        this.circle = [];
        this.markers.forEach((each) => {
            let circle = L.circle(each.getLatLng(), range, {weight: 1}).addTo(this.map);
            this.circles.push(circle);
        });
    });
});


Template.customerPoints.helpers({
    points() {
        return Points.find();
    }
});

Template.customerPoints.events({
    "mouseover [data-role=point]"(event, blazeTemplate){
        let id = $(event.currentTarget).attr("data-id");

        if (blazeTemplate.selectedId === id) {
            return;
        }

        blazeTemplate.selectedId = id;
        if (blazeTemplate.selectedTimeoutId != null) {
            clearTimeout(blazeTemplate.selectedTimeoutId);
        }
        blazeTemplate.selectedTimeoutId = setTimeout(() => {
            let marker = blazeTemplate.markers.find((each) => {
                return each.point._id === blazeTemplate.selectedId;
            });
            blazeTemplate.map.setView(marker.getLatLng(), 16, {animate: true, duration: 1})
        }, 1000);
    },

    "mouseout [data-role=point]"(event, blazeTemplate){
        blazeTemplate.selectedId = null;
        if (blazeTemplate.selectedTimeoutId != null) {
            clearTimeout(blazeTemplate.selectedTimeoutId);
        }
    },

    "click [data-role=point-delete]"(event, blazeTemplate){
        let id = $(event.currentTarget).attr("data-id");
        let point = Points.findOne({_id: id});
        swal({
            title: "Are you sure?",
            text: `Deleting point "${point.name}"`,
            type: "warning",
            showCancelButton: true,
            cancelButtonClass: "btn-default btn-sm",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            confirmButtonClass: "btn-danger btn-sm",
            closeOnConfirm: true
        }, () => {
            Meteor.call("removePoint", point._id);
        });
    },

    "click [data-role=point-edit]": (event, blazeTemplate) => {
        let id = $(event.currentTarget).attr("data-id");
        let point = Points.findOne({_id: id});
        let temp = {
            _id: id,
            from: point.from,
            to: point.to,
            latitude: point.location.coordinates[1],
            longitude: point.location.coordinates[0],
            name: point.name,
            address: point.address,
            invite: point.invite,
            active: point.active
        };
        Modal.show("pointDialog", temp);
    },

    "click [data-role=cancel-point-creation]": (event, blazeTemplate) => {
        blazeTemplate.map.closePopup();
    },

    "click [data-role=confirm-point-creation]": (event, blazeTemplate) => {
        blazeTemplate.map.closePopup();
        let point = {
            latitude: blazeTemplate.popup.getLatLng().lat,
            longitude: blazeTemplate.popup.getLatLng().lng
        };
        Modal.show("pointDialog", point);
    }
});

Template.customerPoints.onRendered(function () {
    let resizePointsWrapper = () => {
        let pointsWrapper = document.getElementById("pointsWrapper");
        let top = pointsWrapper.getBoundingClientRect().top;
        let height = window.innerHeight - top - 10;
        $("#pointsWrapper").css({height: height + "px"});
    };
    window.onresize = function (event) {
        resizePointsWrapper();
    };
    resizePointsWrapper();
    this.map = L.map("map").setView([60.033900, 30.379007], 13);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(this.map);
    this.map.on("click", (e) => {
        var content = `
        Create new point here?<br/>
        <br/>
            <div class="row">
                <div class="col-md-6">
                    <button type="button" class="btn btn-default btn-xs btn-block" data-role="cancel-point-creation">Cancel</button>
                </div>
                <div class="col-md-6">
                    <button type="button" class="btn btn-primary btn-xs btn-block" data-role="confirm-point-creation">Yes</button>
                </div>
            </div>`;
        this.popup = L.popup({closeButton: false}).setLatLng(e.latlng).setContent(content).openOn(this.map);
    });

});

Template.customerPoints.onDestroyed(function () {
    window.onresize = undefined;
});