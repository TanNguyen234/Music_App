import { Response, Request, NextFunction } from "express";
import User from "../model/user.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const tokenUser = req.cookies.tokenUser;

    if(!tokenUser) {
        res.redirect(`/user/login`);
    } else {

        const user = await User.findOne({ tokenUser : tokenUser }).select('-password');

        if(!user) {
            res.redirect(`/user/login`);
        } else {
            res.locals.user = user; //Trả về user thành biến toàn cục ở mọi trang pug
            next();
        }
    }
}