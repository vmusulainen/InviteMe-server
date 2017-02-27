import { Meteor } from "meteor/meteor";

import { Devices } from "../devices";
import { Invites } from "../../invites/invites";

Meteor.methods({
    removeDevice: (aString) => {
        Devices.remove({_id: aString});
        Invites.remove({deviceId: aString});
    },
    clearInvitesForDevice: (aString) => {
        Invites.remove({deviceId: aString});
    }
});