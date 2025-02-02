import { Router } from "express";
const multer = require("multer");
const router: Router = Router();
const upload = multer();

import * as controller from "../../controllers/admin/song.controller";
import * as middleware from "../../middlewares/uploadToCloud.middleware";
import { returnCustomRequest } from "../../interface/CustomRequest";
import { checkPermission } from "../../middlewares/checkPermissions.middleware";

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  checkPermission("render", "song_create"),
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
  checkPermission("render", "song_edit"),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  returnCustomRequest(middleware.uploadToCloud),
  returnCustomRequest(controller.editPatch)
);

router.delete(
  "/delete/:id",
  checkPermission("json", "song_delete"),
  controller.deleteSong
);

router.patch(
  "/change-status",
  checkPermission("json", "song_edit"),
  controller.changeStatus
);

router.patch("/change-multi", checkPermission("render", "song_edit"), returnCustomRequest(controller.changeMulti));

export const songRoutes: Router = router;