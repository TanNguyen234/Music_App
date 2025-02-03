import { Router } from "express";
const multer = require("multer");
const router: Router = Router();
const upload = multer();
import * as controller from '../../controllers/admin/setting.controller'
import * as middleware from "../../middlewares/uploadToCloud.middleware";
import { returnCustomRequest } from "../../interface/CustomRequest";
import { checkPermission } from "../../middlewares/checkPermissions.middleware";

router.get("/general", controller.general);

router.patch("/general", checkPermission("render", "setting_general"), upload.single("logo"), returnCustomRequest(middleware.uploadToCloud), returnCustomRequest(controller.generalPatch));

export const settingRoutes: Router = router;