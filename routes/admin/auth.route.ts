import { Router } from "express";
const router: Router = Router();
import * as controller from '../../controllers/admin/auth.controller'
import { returnCustomRequest } from "../../interface/CustomRequest";

router.get("/login", controller.login);

router.post("/login", returnCustomRequest(controller.loginPost));

router.get('/logout', controller.logout)

export const authRoutes: Router = router;