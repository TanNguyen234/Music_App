import { Router } from "express";
const router: Router = Router();
import * as controller from '../../controllers/admin/role.controller'
import { returnCustomRequest } from "../../interface/CustomRequest";
import { checkPermission } from "../../middlewares/checkPermissions.middleware";

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", checkPermission("render", "roles_create"), returnCustomRequest(controller.createPost));

router.get("/edit/:id", returnCustomRequest(controller.edit));

router.patch("/edit/:id", checkPermission("render", "roles_edit"), returnCustomRequest(controller.editPatch));

router.delete("/delete/:id", checkPermission("json", "roles_delete"), returnCustomRequest(controller.deleteRole));

router.get("/permissions", controller.permission)

router.patch("/permissions", checkPermission("json", "roles_permissions"), controller.permissionPost)

export const roleRoutes: Router = router;