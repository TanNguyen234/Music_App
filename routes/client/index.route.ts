import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";

const clientRoutes = (app: Express): void => {
  app.use('/', dashboardRoutes)
}

export default clientRoutes;