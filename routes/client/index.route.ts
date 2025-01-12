import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { userRoutes } from "./user.route";
import { topicRoutes } from "./topic.route";

import { userInfo } from "../../middlewares/user.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { songRoutes } from "./song.route";

const clientRoutes = (app: Express): void => {
  app.use(userInfo)
  app.use('/', dashboardRoutes)
  app.use('/user', userRoutes)
  app.use('/topics', topicRoutes)
  app.use('/songs', songRoutes)
}

export default clientRoutes;