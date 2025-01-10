import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { userRoutes } from "./user.route";

import { userInfo } from "../../middlewares/user.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";

const clientRoutes = (app: Express): void => {
  app.use(userInfo)
  app.use('/', dashboardRoutes)
  app.use('/user', userRoutes)
}

export default clientRoutes;