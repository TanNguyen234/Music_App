import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
    files: any;
    file: any;
    flash: (type: string, message: string) => void;
}

export const returnCustomRequest = (
  expended: (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    expended(req as CustomRequest, res, next).catch(next);
  };
};