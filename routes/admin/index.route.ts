import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { systemConfig } from "../../config/config";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { roleRoutes } from "./role.route";
import { accountRoutes } from "./account.route";
import { adminInfo } from "../../middlewares/admin.middleware";
import { requireAuthAdmin } from "../../middlewares/authAdmin.middleware";
import { authRoutes } from "./auth.route";
import { settingRoutes } from "./setting.route";
import { settingGeneral } from "../../middlewares/setting.middleware";
import { userRoutes } from "./user.route";

const adminRoutes = (app: Express): void => {
  const PATH_ADMIN = "/" + systemConfig.prefixAdmin;
  app.use(adminInfo)
  app.use(settingGeneral)
  app.use(PATH_ADMIN + "/dashboard", requireAuthAdmin, dashboardRoutes);
  app.use(PATH_ADMIN + "/topics", requireAuthAdmin, topicRoutes);
  app.use(PATH_ADMIN + "/songs", requireAuthAdmin, songRoutes);
  app.use(PATH_ADMIN + "/roles", requireAuthAdmin, roleRoutes);
  app.use(PATH_ADMIN + "/accounts", requireAuthAdmin, accountRoutes);
  app.use(PATH_ADMIN + "/auth", authRoutes)
  app.use(PATH_ADMIN + "/settings", requireAuthAdmin, settingRoutes)
  app.use(PATH_ADMIN + "/users", requireAuthAdmin, userRoutes)
};

export default adminRoutes;