import { Request, Response, NextFunction } from "express"
import { validateLogin, valideRegiter } from "../../validates/user.validate"
import { CustomRequest } from "../../interface/CustomRequest"
import User from "../../model/user.model";
import argon2 from 'argon2';
import { generateRandomString } from "../../helpers/generate";
import FavoriteSong from "../../model/favorite-song.model";

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
                status: "active"                
            }

            const user = new User(data)
            await user.save()

            res.cookie("tokenUser", user.token, {
                httpOnly: true,           // Cookie chỉ truy cập được qua HTTP (bảo mật hơn)
                expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), // Thời gian hết hạn
                secure: true              // Chỉ sử dụng qua HTTPS
            });

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
                    res.cookie("tokenUser", userExist.token, {
                        httpOnly: true,           // Cookie chỉ truy cập được qua HTTP (bảo mật hơn)
                        expires: new Date(Date.now() + 3600 * 1000 * 24 * 30), // Thời gian hết hạn
                        secure: true              // Chỉ sử dụng qua HTTPS
                    });

                    req.flash("success", "Chúc mừng bạn đã đăng nhập thành công")
                    res.redirect("/")
                } else {
                    throw new Error("invalid");
                }
            }
        } catch(err) {
            req.flash("error", "Vui lòng nhập lại!")
            res.redirect(req.get("Referrer") || "/")
        }
    } else {
        req.flash("error", "Vui lòng nhập lại!")
        res.redirect(req.get("Referrer") || "/")
    }
}

//[GET] /user/logout
export const logout = (req: Request, res: Response) => {
    res.clearCookie("tokenUser");
    res.redirect(req.get("Referrer") || "/")
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

//[GET] /user/info
export const info = async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
  
    const user = await User.findOne({
      status: "active",
      deleted: false,
      token: req.cookies.tokenUser,
    }).select("-password");
  
    const favorite = await FavoriteSong.find({
      userId: user?._id,
    })
  
    res.render("client/pages/user/profile", {
      pageTitle: "My profile",
      user: user,
      favorite: favorite.length || 0
    });
  };