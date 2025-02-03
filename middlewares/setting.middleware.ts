import { Response, Request, NextFunction } from "express";
import SettingGeneral from "../model/setting.model";

export const settingGeneral = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const setting = await SettingGeneral.findOne({})

  res.locals.settingGeneral = setting
  
  next();
};