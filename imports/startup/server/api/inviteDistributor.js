import {Points} from "/imports/api/points/points";
import {Devices} from "/imports/api/devices/devices";
import {Invites} from "/imports/api/invites/invites";
import {Settings} from "/imports/api/settings/settings";

export class InviteDistributor {
    static runForDevice(aString) {
        console.log("InviteDistributor.runForDevice", aString);
        let device = Devices.findOne({uuid: aString});
        if (device == null) {
            console.log("InviteDistributor >> device not found with uuid:", aString);
            return;
        }

        if (device.location == null) {
            console.log("InviteDistributor >> device has not location yet");
            return;
        }

        let publicSettings = Settings.findOne({type: "publicSettings"});
        let fcmKey = Settings.findOne({type: "serverSettings"}).fcmWebApiKey;
        let range = publicSettings.inviteRange;
        let reinviteTime = publicSettings.reinviteTime;

        let points = this.getPointsAround(device.location.coordinates, range);

        if (points.count() === 0) {
            console.log("InviteDistributor >> there are no points around");
        }

        points.forEach((each) => {
            let blockDateTime = new Date(new Date().getTime() - reinviteTime * 60000);
            let noInvitesYet = Invites.find({
                    pointId: each._id,
                    deviceId: device._id,
                    createdAt: {$gt: blockDateTime}
                }).count() === 0;

            if (noInvitesYet) {
                let invite = {
                    userId: each.userId,
                    pointId: each._id,
                    createdAt: new Date(),
                    deviceId: device._id,
                    text: each.invite
                };
                let id = Invites.insert(invite);
                invite._id = id;
                this.sendNotification(invite, fcmKey);
                console.log(`InviteDistributor >> invite from ${each.name} is sent`);
            }
            else {
                console.log(`InviteDistributor >> invite from ${each.name} already is sent`);
            }
        })
    }

    static getPointsAround(anArray, aNumber) {
        var time = new Date().getHours() + new Date().getMinutes() / 60;
        return Points.find({
                $and: [
                    {"active": true},
                    {"fromNumber": {$lte: time}},
                    {"toNumber": {$gte: time}},
                    {
                        location: {
                            $near: {
                                $geometry: {
                                    type: "Point", coordinates: anArray
                                },
                                $minDistance: 0,
                                $maxDistance: aNumber
                            }
                        }
                    }]
            }
        );
    }

    static sendNotification(anInvite, aString) {
        let device = Devices.findOne({_id: anInvite.deviceId});
        let point = Points.findOne({_id: anInvite.pointId});

        try {
            let data = {
                "data": {
                    "to": device.fcmToken,
                    "priority": "high",
                    "notification": {
                        "title": point.name,
                        "body": point.invite,
                        "sound": "default",
                        "click_action": this.clickAction(device),
                        "icon": this.notificationIcon(device, point)
                    },
                    "data": {
                        "inviteId": anInvite._id,
                        "pointId": point._id,
                        "pointAddress": point.address,
                        "pointName": point.name,
                        "text": point.invite,
                        "lat": point.location.coordinates[1],
                        "lon": point.location.coordinates[0],
                        "icon": this.notificationIcon(device, point)
                    }
                },
                "headers": {
                    "Authorization": `key=${aString}`,
                    "Content-Type": "application/json"
                }
            };
            console.log("Notification data", data);
            HTTP.post("https://fcm.googleapis.com/fcm/send", data);
        } catch (e) {
            console.log(e.message)
        }
    }

    static clickAction(aDevice) {
        if (aDevice.appType === "native") {
            console.log("clickAction", "Native client is detected");
            return this.clickActionForNativeApp(aDevice);
        }
        else {
            console.log("clickAction", "Hybrid client is detected");
            return this.clickActionForHybridApp(aDevice);
        }
    }

    static clickActionForHybridApp(aDevice) {
        //for phonegap only currently
        return "FCM_PLUGIN_ACTIVITY";
    }

    static clickActionForNativeApp(aDevice) {
        //for android only currently
        return "INVITE_ACTIVITY";
    }

    static notificationIcon(aDevice, aPoint) {
        if (aDevice.appType === "native") {
            console.log("notificationIcon", "Native client is detected");
            return this.notificationIconForNativeApp(aPoint);
        }
        else {
            console.log("notificationIcon", "Hybrid client is detected");
            return this.notificationIconForHybridApp();
        }
    }

    static notificationIconForHybridApp() {
        //for phonegap only currently
        return "fcm_push_icon";
    }

    static notificationIconForNativeApp(aPoint) {
        //for android only currently
        return "ic_" + (aPoint.invite.icon != null ? aPoint.invite.icon : "none");
    }

}