import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'

import { Points } from "/imports/api/points/points";
import { Devices } from "/imports/api/devices/devices";
import { Settings } from "/imports/api/settings/settings";

Meteor.startup(() => {
    if (Settings.find({type: "serverSettings"}).count() === 0) {
        Settings.insert(
            {
                type: "serverSettings",
                fcmWebApiKey: Meteor.settings.private.fcmWebApiKey
            }
        );
    }

    if (Settings.find({type: "publicSettings"}).count() === 0) {
        Settings.insert(
            {
                type: "publicSettings",
                reinviteTime: Meteor.settings.public.reinviteTime,
                inviteRange: Meteor.settings.public.inviteRange
            }
        );
    }
    if (Meteor.users.find().count() === 0) {
        let userId = Accounts.createUser({username: "admin", email: "admin", password: "abc"});
        Meteor.users.update(userId, {
            $set: {
                userType: "superuser"
            }
        });
        userId = Accounts.createUser({username: "customer", email: "customer", password: "abc"});
        Meteor.users.update(userId, {
            $set: {
                userType: "customer"
            }
        });
    }

    Points._ensureIndex({location: "2dsphere"});
    Devices._ensureIndex({location: "2dsphere"});
});
