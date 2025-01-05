import { Router, Request, Response, NextFunction } from "express";
const multer = require("multer");
const router: Router = Router();
const upload = multer();

import * as controller from "../../controllers/admin/song.controller";
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
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  handler(middleware.uploadToCloud),
  handler(controller.createPost)
);

router.get("/edit/:id", handler(controller.edit));

router.patch(
  "/edit/:id",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  handler(middleware.uploadToCloud),
  handler(controller.editPatch)
);

router.delete(
  "/delete/:id",
  handler(controller.deleteSong)
);

export const songRoutes: Router = router;