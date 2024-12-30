import { Request, Response } from "express"

//[GET] /
export const index = async (req: Request, res: Response): Promise<void> => {
    res.render('admin/pages/dashboard/index', {
        pageTitle: 'Trang Chủ'
    })
}