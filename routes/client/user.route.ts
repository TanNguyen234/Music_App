import { Router, Response, NextFunction } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/user.controller";
import { returnCustomRequest } from "../../interface/CustomRequest";

router.get("/register", controller.register);

router.post("/register", returnCustomRequest(controller.registerPost));

router.get("/login", controller.login);

router.post("/login", returnCustomRequest(controller.loginPost));

router.get("/password/forgot", controller.forgot);

router.get("/password/change", controller.change);

export const userRoutes: Router = router;
