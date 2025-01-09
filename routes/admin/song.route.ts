import { Router, Request, Response, NextFunction } from "express";
const multer = require("multer");
const router: Router = Router();
const upload = multer();

import * as controller from "../../controllers/admin/song.controller";
import * as middleware from "../../middlewares/uploadToCloud.middleware";
import { returnCustomRequest } from "../../interface/CustomRequest";

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  returnCustomRequest(middleware.uploadToCloud),
  returnCustomRequest(controller.createPost)
);

router.get("/edit/:id", returnCustomRequest(controller.edit));

router.patch(
  "/edit/:id",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  returnCustomRequest(middleware.uploadToCloud),
  returnCustomRequest(controller.editPatch)
);

router.delete(
  "/delete/:id",
  returnCustomRequest(controller.deleteSong)
);

export const songRoutes: Router = router;