import { Router } from "express";
const router: Router = Router();
import * as controller from '../../controllers/client/user.controller'

router.get("/register", controller.register);

router.get("/login", controller.login);

export const userRoutes: Router = router;