import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { systemConfig } from "../../config/config";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { roleRoutes } from "./role.route";

const adminRoutes = (app: Express): void => {
  const PATH_ADMIN = "/" + systemConfig.prefixAdmin;

  app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
  app.use(PATH_ADMIN + "/topics", topicRoutes);
  app.use(PATH_ADMIN + "/songs", songRoutes);
  app.use(PATH_ADMIN + "/roles", roleRoutes);
};

export default adminRoutes;