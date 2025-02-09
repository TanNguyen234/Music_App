import { Request, Response } from "express"
import { isValidEmail, validateLogin } from "../../validates/user.validate"
import { CustomRequest } from "../../interface/CustomRequest"
import argon2 from 'argon2';
import { systemConfig } from "../../config/config";
import Account from "../../model/account.model";

//[GET] /admin/auth/login
export const login = (req: Request, res: Response) => {
    res.render('admin/pages/auth/login', {
        pageTitle: 'Trang đăng nhập',
    })
}

//[POST] /admin/auth/login
export const loginPost = async (req: CustomRequest, res: Response): Promise<void> => {
    const condition: Boolean = await validateLogin(req.body);
    if(condition) {
        try {
            const { email, password } = req.body;
            const userExist = await Account.findOne({
                email: email
            })
            if(!userExist) {
                throw new Error(`Admin ${email} does not exist`);
            } else {
                if(await argon2.verify(userExist.password as string, password)) {
                    res.cookie("tokenAdmin", userExist.token, {
                        httpOnly: true,           // Cookie chỉ truy cập được qua HTTP (bảo mật hơn)
                        expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), // Thời gian hết hạn
                        secure: true              // Chỉ sử dụng qua HTTPS
                    });

                    req.flash("success", "Chúc mừng bạn đã đăng nhập thành công")
                    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`)
                } else {
                    throw new Error("invalid");
                }
            }
        } catch(err) {
            req.flash("error", "Vui lòng nhập lại!")
            res.redirect(req.get("Referrer") || `/${systemConfig.prefixAdmin}/dashboard`)
        }
    } else {
        req.flash("error", "Vui lòng nhập lại!")
        res.redirect(req.get("Referrer") || `/${systemConfig.prefixAdmin}/dashboard`)
    }
}

//[GET] /admin/auth/logout
export const logout = (req: Request, res: Response) => {
    res.clearCookie("tokenAdmin");
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`)
}

//[GET] /admin/auth/profile
export const profile = async (req: CustomRequest, res: Response): Promise<void> => {
    res.render("admin/pages/auth/profile.pug", {
        pageTitle: 'Trang thông tin tài khoản'
    })
}

interface AdminInterface {
    fullName?: string;
    email?: string;
    phone?: string;
    avatar?: string
}

//[PATCH] /admin/auth/profile
export const profilePatch = async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, phone, avatar } = req.body;
    let saveData: AdminInterface = {}
    if(fullName) {
        if(fullName.length < 8 && fullName.length > 30) {
            res.json({
                code: 400,
                message: "Tên phải từ 8 đến 30 kí tự"
            })
        } else {
            saveData.fullName = fullName
        }
    }

    if(email) {
        if(!isValidEmail(email)) {
            res.json({
                code: 400,
                message: "Email không hợp lệ"
            })
        }
    }

    if(phone) {
        if(phone.length !== 10) {
            res.json({
                code: 400,
                message: "Số điện thoại phải có 10 chữ số"
            })
        }
    }

    if(avatar) saveData.avatar = avatar

    await Account.updateOne({
        token: req.cookies.tokenAdmin
    }, saveData);

    res.json({
        code: 200,
        message: "Thành công",
        data: saveData
    })
}