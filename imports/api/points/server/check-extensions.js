import {check} from "meteor/check";


Match.NotEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length > 0;
});

