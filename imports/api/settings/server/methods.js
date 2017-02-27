import { Settings } from "../settings";

Meteor.methods({
    updateServerSettings(anObject) {
        check(anObject, {
            fcmWebApiKey: String,
            inviteRange: Number,
            reinviteTime: Number
        });

        Settings.update({type: "serverSettings"}, {
            $set: {
                fcmWebApiKey: anObject.fcmWebApiKey
            }
        });

        Settings.update({type: "publicSettings"}, {
            $set: {
                inviteRange: anObject.inviteRange,
                reinviteTime: anObject.reinviteTime
            }
        });

    }
});