import { Router, Response, NextFunction } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/user.controller";
import { returnCustomRequest } from "../../interface/CustomRequest";
import { requireAuth } from "../../middlewares/auth.middleware";

router.get("/register", controller.register);

router.post("/register", returnCustomRequest(controller.registerPost));

router.get("/login", controller.login);

router.post("/login", returnCustomRequest(controller.loginPost));

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgot);

router.get("/password/change", controller.change);

router.get("/info", requireAuth, returnCustomRequest(controller.info));

export const userRoutes: Router = router;
