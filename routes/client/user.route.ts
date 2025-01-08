import { Router } from "express";
const router: Router = Router();
import * as controller from '../../controllers/client/user.controller'

router.get("/register", controller.register);

router.get("/login", controller.login);

router.get("/password/forgot", controller.forgot);

router.get("/password/change", controller.change);

export const userRoutes: Router = router;