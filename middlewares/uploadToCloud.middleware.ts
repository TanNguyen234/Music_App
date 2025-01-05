import { Response, NextFunction } from "express"
import { uploadToCloudinary } from "../helpers/uploadToCloudinary";
import { CustomRequest } from "../controllers/admin/topic.controller";

export const uploadToCloud = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    if (req.file) {
        const buffer = req.file.buffer;
        const mimetype = req.file.mimetype;
        const result = await uploadToCloudinary(buffer, mimetype);
        req.body[req.file.fieldname] = result;
    }

    if(req.files && (req.files.avatar || req.files.audio)) {
        if(req.files.avatar.length > 0) {
            const avatar = req.files.avatar[0]
            const buffer = avatar.buffer;
            const mimetype = avatar.mimetype;
            const result = await uploadToCloudinary(buffer, mimetype);
            req.body[avatar.fieldname] = result;
        }

        if(req.files.audio.length > 0) {
            const audio = req.files.audio[0]
            const buffer = audio.buffer;
            const mimetype = audio.mimetype;
            const result = await uploadToCloudinary(buffer, mimetype);
            req.body[audio.fieldname] = result;
        }
    }
    next();
}