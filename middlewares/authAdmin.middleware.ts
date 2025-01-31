import { Response, Request, NextFunction } from "express";
import { systemConfig } from "../config/config";
import Account from "../model/account.model";
import Roles from "../model/role.model";

export const requireAuthAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const tokenAdmin = req.cookies.tokenAdmin;

    if(!tokenAdmin) {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    } else {

        const admin = await Account.findOne({ token : tokenAdmin }).select('-password');

        if(!admin) {
            res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        } else {
            const role = await Roles.findOne({
                _id: admin.role_id
            }).select("title permissions")
            
            res.locals.admin = admin; //Trả về user thành biến toàn cục ở mọi trang pug
            res.locals.role = role; //Trả về quyền thành biến toàn cục ở mọi trang pug
            next();
        }
    }
}