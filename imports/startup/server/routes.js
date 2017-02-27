import bodyParser from 'body-parser';

import {Points} from "/imports/api/points/points";
import {Devices} from "/imports/api/devices/devices";
import {Invites} from "/imports/api/invites/invites";
import {InviteDistributor} from "./api/inviteDistributor";

Meteor.startup(() => {

    Picker.middleware(bodyParser.json());
    Picker.middleware(bodyParser.urlencoded({extended: false}));


    let optionsRoutes = Picker.filter(function (req, res) {
        return req.method === "OPTIONS";
    });

    let putRoutes = Picker.filter(function (req, res) {
        return req.method === "PUT";
    });

    let getRoutes = Picker.filter(function (req, res) {
        return req.method === "GET";
    });

    optionsRoutes.route("/devices/:id", function (params, request, response, next) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "PUT");
        response.setHeader("Access-Control-Max-Age", "86400");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.end();
    });

    optionsRoutes.route("/devices/:id/location", function (params, request, response, next) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "PUT");
        response.setHeader("Access-Control-Max-Age", "86400");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.end();
    });

    putRoutes.route("/devices/:id", function (params, request, response, next) {
        console.log("Registering device", request.body);
        response.setHeader("Access-Control-Allow-Origin", "*");
        try {
            let data = request.body;
            check(data, {
                uuid: String,
                model: String,
                platform: String,
                appType: String,
                version: String,
                fcmToken: String
            });
            if (Devices.findOne({uuid: data.uuid}) == null) {
                console.log("New device is being created");
                Devices.insert(
                    {
                        uuid: data.uuid,
                        model: data.model,
                        platform: data.platform,
                        appType: data.appType,
                        version: data.version,
                        fcmToken: data.fcmToken,
                        createdAt: new Date()
                    });
            } else {
                console.log("Device is being updated");
                Devices.update({uuid: data.uuid}, {
                    $set: {
                        uuid: data.uuid,
                        model: data.model,
                        platform: data.platform,
                        appType: data.appType,
                        version: data.version,
                        fcmToken: data.fcmToken,
                        updatedAt: new Date()
                    }
                });
            }
            console.log("Device has registered successfully");
            response.statusCode = 200;
            response.end(JSON.stringify({code: 200, message: " Device is registered"}));
        }
        catch (e) {
            console.log("Registering device error", e);
            response.statusCode = e.statusCode || 500;
            response.end(JSON.stringify({code: 500, message: e.message}));
        }
    });

    putRoutes.route("/devices/:id/location", function (params, request, response, next) {
        let data = request.body;
        console.log("Device location updating", data);
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Content-Type", "application/json");
        try {
            check(data, {
                uuid: String,
                latitude: Number,
                longitude: Number,
                timestamp: Match.Where((x) => {
                    return isNaN(new Date(x).getTime()) === false
                })
            });
            check(new Date(data.timestamp), Date);
            let result = Devices.update({uuid: data.uuid}, {
                $set: {
                    location: {
                        coordinates: [data.longitude, data.latitude],
                        type: "Point",
                        updatedAtDeviceTimestamp: new Date(data.timestamp),
                        updatedAtServerTimestamp: new Date()
                    }
                }
            });
            if (result === 0) {
                throw {statusCode: 404, statusMessage: "Device not found"};
            }
            response.statusCode = 200;
            response.end(JSON.stringify({code: 200, message: "Device's location is updated"}));
            InviteDistributor.runForDevice(data.uuid);
        }
        catch (e) {
            response.statusCode = e.statusCode || 500;
            response.end(JSON.stringify({code: 500, message: e.message}));
        }
    });

    getRoutes.route("/devices/:id/invites", function (params, request, response, next) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Content-Type", "application/json");
        try {
            let device = Devices.findOne({uuid: params.id});
            if (device == null) {
                throw {statusCode: 404, statusMessage: "Device not found"};
            }
            let invites = Invites.find({deviceId: device._id});
            let results = invites.map((each) => {
                let point = Points.findOne({_id: each.pointId});
                each.point = point;
                return each;
            });
            response.statusCode = 200;
            response.end(JSON.stringify(results));
        }
        catch (e) {
            response.statusCode = e.statusCode || 500;
            response.end(JSON.stringify({code: 500, message: e.message}));
        }
    });

    getRoutes.route("/invites/:id", function (params, request, response, next) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Content-Type", "application/json");
        try {
            let invite = Invites.findOne({_id: params.id});
            if (invite == null) {
                throw {statusCode: 404, statusMessage: "Invite not found"};
            }
            let point = Points.findOne({_id: invite.pointId});
            invite.point = point;
            response.statusCode = 200;
            response.end(JSON.stringify(invite));
        }
        catch (e) {
            response.statusCode = e.statusCode || 500;
            response.end(JSON.stringify({code: 500, message: e.message}));
        }
    });
});