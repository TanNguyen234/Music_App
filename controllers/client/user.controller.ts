import { Request, Response, NextFunction } from "express"
import { validateLogin, valideRegiter } from "../../validates/user.validate"
import { CustomRequest } from "../../interface/CustomRequest"
import User from "../../model/user.model";
import argon2 from 'argon2';
import { generateRandomString } from "../../helpers/generate";

//[GET] /user/register
export const register = (req: Request, res: Response) => {
    res.render('client/pages/user/register', {
        pageTitle: 'Trang đăng ký',
    })
}

//[POST] /user/register
export const registerPost = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const condition: Boolean = await valideRegiter(req.body);
    if(condition) {
        try {
            const hashedPassword = await argon2.hash(req.body.password);

            const data = {
                fullName: req.body.fullName,
                email: req.body.email,
                token: generateRandomString(20),
                password: hashedPassword,
            }

            const user = new User(data)
            await user.save()
            req.flash("success", "Chúc mừng bạn đã đăng ký thành công")
            res.redirect("/")
        } catch(err) {
            req.flash("error", "Dữ liệu nhập vào không hợp lệ!")
            res.redirect(req.get("Referrer") || "/")
        }
    } else {
        req.flash("error", "Dữ liệu nhập vào không hợp lệ!")
        res.redirect(req.get("Referrer") || "/")
    }
}

//[GET] /user/login
export const login = (req: Request, res: Response) => {
    res.render('client/pages/user/login', {
        pageTitle: 'Trang đăng nhập',
    })
}

//[POST] /user/login
export const loginPost = async (req: CustomRequest, res: Response): Promise<void> => {
    const condition: Boolean = await validateLogin(req.body);
    if(condition) {
        try {
            const { email, password } = req.body;
            const userExist = await User.findOne({
                email: email
            })
            if(!userExist) {
                throw new Error(`User ${email} does not exist`);
            } else {
                if(await argon2.verify(userExist.password as string, password)) {
                    req.flash("success", "Chúc mừng bạn đã đăng ký thành công")
                    res.redirect("/")
                } else {
                    throw new Error("invalid");
                }
            }
        } catch(err) {
            req.flash("error", "Dữ liệu nhập vào không hợp lệ!")
            res.redirect(req.get("Referrer") || "/")
        }
    } else {
        req.flash("error", "Dữ liệu nhập vào không hợp lệ!")
        res.redirect(req.get("Referrer") || "/")
    }
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