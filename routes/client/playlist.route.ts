import { Router } from "express";
const router: Router = Router();
import * as controller from '../../controllers/client/playlist.controller';
import { returnCustomRequest } from "../../interface/CustomRequest";

router.get("/", returnCustomRequest(controller.index));

export const playlistRoutes: Router = router;