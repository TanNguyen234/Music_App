import { Request, Response } from "express"
import Song from "../../model/song.model"

//[GET] /user/register
export const register = (req: Request, res: Response) => {
    res.render('client/pages/user/register', {
        pageTitle: 'Trang đăng ký',
    })
}

//[GET] /user/login
export const login = (req: Request, res: Response) => {
    res.render('client/pages/user/login', {
        pageTitle: 'Trang đăng nhập',
    })
}