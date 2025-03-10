import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { userRoutes } from "./user.route";
import { topicRoutes } from "./topic.route";

import { userInfo } from "../../middlewares/user.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { songRoutes } from "./song.route";
import { resultRoutes } from "./result.route";
import { playlistRoutes } from "./playlist.route";
import { settingGeneral } from "../../middlewares/setting.middleware";

const clientRoutes = (app: Express): void => {
  app.use(userInfo)
  app.use(settingGeneral)
  app.use('/', dashboardRoutes)
  app.use('/user', userRoutes)
  app.use('/topics', topicRoutes)
  app.use('/songs', requireAuth, songRoutes)
  app.use('/result', requireAuth, resultRoutes)
  app.use('/playlist', requireAuth, playlistRoutes)
}

export default clientRoutes;