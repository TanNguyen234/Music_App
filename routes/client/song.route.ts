import { Router } from "express";
const router: Router = Router();
import * as controller from '../../controllers/client/song.controller';
import { returnCustomRequest } from "../../interface/CustomRequest";

router.get("/", returnCustomRequest(controller.index));

export const songRoutes: Router = router;