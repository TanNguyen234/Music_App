import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { userRoutes } from "./user.route";

const clientRoutes = (app: Express): void => {
  app.use('/', dashboardRoutes)
  app.use('/user', userRoutes)
}

export default clientRoutes;