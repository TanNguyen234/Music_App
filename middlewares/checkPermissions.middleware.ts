import { Response, Request, NextFunction, RequestHandler } from "express";
import { CustomRequest } from "../interface/CustomRequest";

export const checkPermission = (type: "render" | "json", permission: string): any => {
    return (req: Request | CustomRequest, res: Response, next: NextFunction) => {
        const permissions = res.locals.role.permissions;
        console.log(permissions)
        if (!permissions.includes(permission)) {
            if(type === "render") {
                res.render("admin/partials/403.pug")
            } else if (type === "json") {
                return res.json({ 
                    code: 403,
                    message: "Bạn không có quyền thực hiện hành động này" 
                });
            }
        }
        next();
    };
};