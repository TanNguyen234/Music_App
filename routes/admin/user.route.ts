import { Router } from "express";
const multer = require("multer");
const router: Router = Router();
const upload = multer();
import * as controller from '../../controllers/admin/user.controller'
import * as middleware from "../../middlewares/uploadToCloud.middleware";
import { returnCustomRequest } from "../../interface/CustomRequest";
import { checkPermission } from "../../middlewares/checkPermissions.middleware";

router.get("/", controller.index);

router.get("/edit/:id", returnCustomRequest(controller.edit));

router.patch("/edit/:id", checkPermission("render", "user_edit"), upload.single("avatar"), returnCustomRequest(middleware.uploadToCloud), returnCustomRequest(controller.editPatch));

router.patch('/change-status', checkPermission("json", "user_edit"), controller.changeStatus)

router.delete("/delete/:id", checkPermission("json", "user_delete"), returnCustomRequest(controller.deleteUser));

export const userRoutes: Router = router;