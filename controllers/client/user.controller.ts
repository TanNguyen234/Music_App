import { Request, Response, NextFunction } from "express"
import { isValidEmail, validateLogin, valideRegiter } from "../../validates/user.validate"
import { CustomRequest } from "../../interface/CustomRequest"
import User from "../../model/user.model";
import argon2 from 'argon2';
import { generateRandomNumber, generateRandomString } from "../../helpers/generate";
import FavoriteSong from "../../model/favorite-song.model";
import Forgot from "../../model/forgot.model";
import sendMail from "../../helpers/sendMail";

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

//[POST] /user/password/forgot
export const forgotPost = async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    if(isValidEmail(email) && otp) {
        const valid = await Forgot.findOne({
            email: email,
            otp: otp
        })
        if(valid) {
            res.render('client/pages/user/changePassword', {
                pageTitle: 'Trang đổi mật khẩu',
                email: email
            })
        } else {
            res.redirect("back");
        }
    } else {
        res.redirect("back");
    }
}

//[POST] /user/password/otp
export const otp = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    if(isValidEmail(email)) {
        const user = await User.findOne({
            email: email
        })
        if(!user) {
            res.json({
                code: 400,
                message: "Email không tồn tại"
            })
        } else {
            await Forgot.deleteMany({
                email: email
            })

            const otp = generateRandomNumber(8);
            const forgotPassword = new Forgot({
                email,
                otp
            })

            forgotPassword.save()
            const subject = "Mã xác minh lấy lại mật khẩu";
            const html = `
              <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                <h1 style="text-align: center; color: #2c3e50;">Mã xác minh đổi mật khẩu</h1>
                <div style="font-size: 16px; margin: 20px 0;">
                  <p style="margin: 0; padding: 0;">Mã xác minh của bạn là: 
                    <b style="color: green; font-size: 18px;">${otp}</b>
                  </p>
                  <p style="margin-top: 20px;">Thời hạn sử dụng là <b>3 phút</b>.</p>
                </div>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="font-size: 14px; color: #888; text-align: center;">
                  Nếu bạn không yêu cầu đổi mật khẩu, hãy bỏ qua email này.
                </p>
              </div>`;
            
            const sent = await sendMail(email, subject, html);
            if(sent) {
                res.json({
                    code: 200,
                    message: "OTP sent successfully"
                })
            } else {
                res.json({
                    code: 400,
                    message: "Mã OTP đã gửi không thành công vui lòng gửi lại!"
                })
            }
        }
    } else {
        res.json({
            code: 400,
            message: "Email không hợp lệ"
        })
    }
}

//[PATCH] /user/password/change
export const change = async (req: CustomRequest, res: Response): Promise<void> => {
    const { email, password, passwordCheck } = req.body;
    if(password !== passwordCheck) {
        req.flash("error", "Mật khẩu không trùng khớp")
        res.redirect(req.get("Referrer") || "/")
    }

    if(password.length < 8 || password.length > 30) {
        req.flash("error", "Mật khẩu phải từ 8 đến 30 kí tự")
        res.redirect(req.get("Referrer") || "/")
    }
    
    if(!isValidEmail(email)) {
        await User.updateOne({
            email: email
        }, {
            password: await argon2.hash(password)
        })
        const user = await User.findOne({
            email: email
        })
        req.cookies.tokenUser = user?.token;
        req.flash("success", "Đổi mật khẩu thành công!")
        res.redirect('/')
    } else {
        req.flash("error", "Email không hợp lệ")
        res.redirect(req.get("Referrer") || "/");
    }
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

//[POST] /user/edit
export const edit = async (req: Request, res: Response): Promise<void> => {
    const { fullName, email } = req.body;

    if(fullName) {
        if(fullName.length < 8 && fullName.length > 30) {
            res.json({
                code: 400,
                message: "Tên phải từ 8 đến 30 kí tự"
            })
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

    await User.updateOne({
        token: req.cookies.tokenUser
    }, req.body);

    res.json({
        code: 200,
        message: "Thành công",
        data: req.body
    })
}
