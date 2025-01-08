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

//[GET] /user/password/forgot
export const forgot = (req: Request, res: Response) => {
    res.render('client/pages/user/forgotPassword', {
        pageTitle: 'Trang gửi otp',
    })
}


//[GET] /user/password/change
export const change = (req: Request, res: Response) => {
    res.render('client/pages/user/changePassword', {
        pageTitle: 'Trang đổi mật khẩu',
    })
}