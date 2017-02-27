import { Meteor } from "meteor/meteor";

// Registering API
import "/imports/api/accounts/server";
import "/imports/api/points/server";
import "/imports/api/devices/server";
import "/imports/api/invites/server";
import "/imports/api/settings/server";

import "./routes";
import "./fixtures";

Meteor.startup(() => {
    process.env.MAIL_URL = Meteor.settings.private.mailUrl;
});