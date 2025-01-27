import { Router } from "express";
const router: Router = Router();
import * as controller from '../../controllers/admin/role.controller'
import { returnCustomRequest } from "../../interface/CustomRequest";

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", returnCustomRequest(controller.createPost));

router.get("/edit/:id", returnCustomRequest(controller.edit));

router.patch("/edit/:id", returnCustomRequest(controller.editPatch));

router.delete("/delete/:id", returnCustomRequest(controller.deleteRole));

export const roleRoutes: Router = router;