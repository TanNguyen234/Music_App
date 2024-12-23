import { Request, Response } from "express"

//[GET] /
export const index = (req: Request, res: Response) => {
    res.render('client/pages/dashboard/dashboard', {
        pageTitle: 'Trang Chủ'
    })
}