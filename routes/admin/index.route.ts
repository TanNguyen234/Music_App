import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { systemConfig } from "../../config/config";

const adminRoutes = (app: Express): void => {
  const PATH_ADMIN = "/" + systemConfig.prefixAmin;
  console.log(PATH_ADMIN);
  app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
};

export default adminRoutes;