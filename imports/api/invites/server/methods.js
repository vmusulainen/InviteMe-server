import {Invites} from "../invites";
import {Devices} from "../../devices/devices";
import {Points} from "../../points/points";

Meteor.methods({
        customerTheLastInvites(){
            let invites = Invites.aggregate(
                [
                    {$match: {userId: Meteor.userId()}},
                    {$sort: {createdAt: -1}},
                    {
                        $group: {
                            _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                            count: {$sum: 1}
                        }
                    }
                ]
            );

            return invites;

        }
    }
);