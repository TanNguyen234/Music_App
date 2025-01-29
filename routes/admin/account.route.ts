import { Router } from "express";
const multer = require("multer");
const router: Router = Router();
const upload = multer();
import * as controller from '../../controllers/admin/account.controller'
import * as middleware from "../../middlewares/uploadToCloud.middleware";
import { returnCustomRequest } from "../../interface/CustomRequest";

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", upload.single("avatar"), returnCustomRequest(middleware.uploadToCloud), returnCustomRequest(controller.createPost));

router.get("/edit/:id", returnCustomRequest(controller.edit));

router.patch("/edit/:id", upload.single("avatar"), returnCustomRequest(middleware.uploadToCloud), returnCustomRequest(controller.editPatch));

router.delete("/delete/:id", returnCustomRequest(controller.deleteRole));

export const accountRoutes: Router = router;