import { Router, Request, Response, NextFunction } from "express";
const multer = require("multer");
const router: Router = Router();
const upload = multer();

import * as controller from "../../controllers/admin/topic.controller";
import * as middleware from "../../middlewares/uploadToCloud.middleware";

const handler = (
  expended: (
    req: controller.CustomRequest,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    expended(req as controller.CustomRequest, res, next).catch(next);
  };
};

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  handler(middleware.uploadToCloud),
  handler(controller.createPost)
);

router.get("/edit/:id", handler(controller.edit));

export const topicRoutes: Router = router;
