import { Router } from "express";
const router: Router = Router();
import * as controller from '../../controllers/admin/auth.controller'
import { returnCustomRequest } from "../../interface/CustomRequest";
import { requireAuthAdmin } from "../../middlewares/authAdmin.middleware";

router.get("/login", controller.login);

router.post("/login", returnCustomRequest(controller.loginPost));

router.get('/logout', controller.logout)

router.get('/profile', requireAuthAdmin, returnCustomRequest(controller.profile))

export const authRoutes: Router = router;