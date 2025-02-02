import { Router } from "express";
const multer = require("multer");
const router: Router = Router();
const upload = multer();

import * as controller from "../../controllers/admin/topic.controller";
import * as middleware from "../../middlewares/uploadToCloud.middleware";
import { returnCustomRequest } from "../../interface/CustomRequest";
import { checkPermission } from "../../middlewares/checkPermissions.middleware";

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  checkPermission("render", "topic_create"),
  upload.single("avatar"),
  returnCustomRequest(middleware.uploadToCloud),
  returnCustomRequest(controller.createPost)
);

router.get("/edit/:id", returnCustomRequest(controller.edit));

router.patch(
  "/edit/:id",
  checkPermission("render", "topic_edit"),
  upload.single("avatar"),
  returnCustomRequest(middleware.uploadToCloud),
  returnCustomRequest(controller.editPatch)
);

router.delete(
  "/delete/:id",
  checkPermission("json", "topic_delete"),
  controller.deleteTopic
);

router.get("/detail/:id", controller.detail);

router.patch(
  "/change-status",
  checkPermission("json", "topic_edit"),
  controller.changeStatus
);

router.patch(
  "/change-multi",
  checkPermission("render", "topic_edit"),
  returnCustomRequest(controller.changeMulti)
);

export const topicRoutes: Router = router;
