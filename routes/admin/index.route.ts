import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { systemConfig } from "../../config/config";
import { topicRoutes } from "./topic.route";

const adminRoutes = (app: Express): void => {
  const PATH_ADMIN = "/" + systemConfig.prefixAmin;

  app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
  app.use(PATH_ADMIN + "/topics", topicRoutes);
};

export default adminRoutes;