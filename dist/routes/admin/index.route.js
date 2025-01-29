"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_route_1 = require("./dashboard.route");
const config_1 = require("../../config/config");
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const role_route_1 = require("./role.route");
const account_route_1 = require("./account.route");
const adminRoutes = (app) => {
    const PATH_ADMIN = "/" + config_1.systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", dashboard_route_1.dashboardRoutes);
    app.use(PATH_ADMIN + "/topics", topic_route_1.topicRoutes);
    app.use(PATH_ADMIN + "/songs", song_route_1.songRoutes);
    app.use(PATH_ADMIN + "/roles", role_route_1.roleRoutes);
    app.use(PATH_ADMIN + "/accounts", account_route_1.accountRoutes);
};
exports.default = adminRoutes;
