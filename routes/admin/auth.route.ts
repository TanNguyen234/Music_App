import { Router } from "express";
const multer = require("multer");
const router: Router = Router();
const upload = multer();

import * as controller from "../../controllers/admin/auth.controller";
import * as middleware from "../../middlewares/uploadToCloud.middleware";
import { returnCustomRequest } from "../../interface/CustomRequest";
import { requireAuthAdmin } from "../../middlewares/authAdmin.middleware";

router.get("/login", controller.login);

router.post("/login", returnCustomRequest(controller.loginPost));

router.get("/logout", controller.logout);

router.get(
  "/profile",
  requireAuthAdmin,
  returnCustomRequest(controller.profile)
);

router.patch(
  "/profile",
  requireAuthAdmin,
  upload.single("avatar"),
  returnCustomRequest(middleware.uploadToCloud),
  returnCustomRequest(controller.profilePatch)
);

export const authRoutes: Router = router;
