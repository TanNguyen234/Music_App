import { Router } from "express";
const router: Router = Router();
import * as controller from '../../controllers/client/song.controller';
import { returnCustomRequest } from "../../interface/CustomRequest";

router.get("/", returnCustomRequest(controller.index));

router.get("/:id", returnCustomRequest(controller.listen));

export const songRoutes: Router = router;