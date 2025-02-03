import { Router } from "express";
const multer = require("multer");
const router: Router = Router();
const upload = multer();
import * as controller from '../../controllers/admin/account.controller'
import * as middleware from "../../middlewares/uploadToCloud.middleware";
import { returnCustomRequest } from "../../interface/CustomRequest";
import { checkPermission } from "../../middlewares/checkPermissions.middleware";

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", checkPermission("render", "admin_create"), upload.single("avatar"), returnCustomRequest(middleware.uploadToCloud), returnCustomRequest(controller.createPost));

router.get("/edit/:id", returnCustomRequest(controller.edit));

router.patch("/edit/:id", checkPermission("render", "admin_edit"), upload.single("avatar"), returnCustomRequest(middleware.uploadToCloud), returnCustomRequest(controller.editPatch));

router.patch('/change-status', checkPermission("json", "admin_edit"), controller.changeStatus)

router.delete("/delete/:id", checkPermission("json", "admin_delete"), returnCustomRequest(controller.deleteRole));

export const accountRoutes: Router = router;