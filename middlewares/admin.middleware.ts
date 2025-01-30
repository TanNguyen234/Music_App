import { Response, Request, NextFunction } from "express";
import Account from "../model/account.model";

export const adminInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  if (req.cookies.tokenAdmin) {
    const admin = await Account.findOne({
      token: req.cookies.tokenAdmin,
      status: "active",
      deleted: false,
    }).select('-password');
    
    if(admin) {
        res.locals.admin = admin
    }
  }
  next();
};