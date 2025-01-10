import { Response, Request, NextFunction } from "express";
import User from "../model/user.model";

export const userInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      token: req.cookies.tokenUser,
      status: "active",
      deleted: false,
    }).select('-password');
    
    if(user) {
        res.locals.user = user
    }
  }
  next();
};
