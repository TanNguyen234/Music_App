import { Response, NextFunction } from "express"
import { uploadToCloudinary } from "../helpers/uploadToCloudinary";
import { CustomRequest } from "../controllers/admin/topic.controller";

export const uploadToCloud = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.file) {
        console.log(req.file);
        const buffer = req.file.buffer;
        const mimetype = req.file.mimetype;
        const result = await uploadToCloudinary(buffer, mimetype);
        req.body[req.file.fieldname] = result;
    }
    next();
}