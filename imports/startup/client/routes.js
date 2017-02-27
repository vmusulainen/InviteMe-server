FlowRouter.route('/', {
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "main"});
    }
});

FlowRouter.route('/pricing', {
    name: "pricing",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "pricing"});
    }
});

FlowRouter.route('/features', {
    name: "features",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "features"});
    }
});

FlowRouter.route('/help', {
    name: "help",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "help"});
    }
});

FlowRouter.route('/signIn', {
    name: "signIn",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "signIn"});
    }
});

FlowRouter.route('/signUp', {
    name: "signUp",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "signUp"});
    }
});

FlowRouter.route('/emailVerification', {
    name: "emailVerification",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "emailVerification"});
    }
});

FlowRouter.route('/resetPassword', {
    name: "resetPassword",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "resetPassword"});
    }
});

FlowRouter.route('/setPassword/:token', {
    name: "setPassword",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "setPassword"});
    }
});


let superuserRoutes = FlowRouter.group({
    prefix: "/superuser",
    triggersEnter: [function (context, redirect) {
        if (Meteor.userId() == null) {
            redirect("/signIn");
        }
    }]
});

superuserRoutes.route("/summary", {
    name: "superuserSummary",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "superuserSummary"});
    }
});

superuserRoutes.route("/devices", {
    name: "superuserDevices",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "superuserDevices"});
    }
});

superuserRoutes.route("/settings", {
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "superuserSettings"});
    }
});


let customerRoutes = FlowRouter.group({
    prefix: "/users",
    triggersEnter: [function (context, redirect) {
        if (Meteor.userId() == null) {
            redirect("/signIn");
        }
    }]
});

customerRoutes.route("/:id", {
    name: "customerSummary",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "customerSummary"});
    }
});

customerRoutes.route("/:id/welcome", {
    name: "customerWelcome",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "customerWelcome"});
    }
});

customerRoutes.route("/:id/points", {
    name: "customerWelcome",
    action: function (params) {
        BlazeLayout.render("mainLayout", {content: "customerPoints"});
    }
});

