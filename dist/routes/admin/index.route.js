"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_route_1 = require("./dashboard.route");
const config_1 = require("../../config/config");
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const role_route_1 = require("./role.route");
const account_route_1 = require("./account.route");
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const authAdmin_middleware_1 = require("../../middlewares/authAdmin.middleware");
const auth_route_1 = require("./auth.route");
const adminRoutes = (app) => {
    const PATH_ADMIN = "/" + config_1.systemConfig.prefixAdmin;
    app.use(admin_middleware_1.adminInfo);
    app.use(PATH_ADMIN + "/dashboard", dashboard_route_1.dashboardRoutes);
    app.use(PATH_ADMIN + "/topics", authAdmin_middleware_1.requireAuthAdmin, topic_route_1.topicRoutes);
    app.use(PATH_ADMIN + "/songs", authAdmin_middleware_1.requireAuthAdmin, song_route_1.songRoutes);
    app.use(PATH_ADMIN + "/roles", authAdmin_middleware_1.requireAuthAdmin, role_route_1.roleRoutes);
    app.use(PATH_ADMIN + "/accounts", authAdmin_middleware_1.requireAuthAdmin, account_route_1.accountRoutes);
    app.use(PATH_ADMIN + "/auth", auth_route_1.authRoutes);
};
exports.default = adminRoutes;
