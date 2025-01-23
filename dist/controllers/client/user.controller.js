"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.edit = exports.info = exports.change = exports.otp = exports.forgotPost = exports.forgot = exports.logout = exports.loginPost = exports.login = exports.registerPost = exports.register = void 0;
const user_validate_1 = require("../../validates/user.validate");
const user_model_1 = __importDefault(require("../../model/user.model"));
const argon2_1 = __importDefault(require("argon2"));
const generate_1 = require("../../helpers/generate");
const favorite_song_model_1 = __importDefault(require("../../model/favorite-song.model"));
const forgot_model_1 = __importDefault(require("../../model/forgot.model"));
const sendMail_1 = __importDefault(require("../../helpers/sendMail"));
const register = (req, res) => {
    res.render('client/pages/user/register', {
        pageTitle: 'Trang đăng ký',
    });
};
exports.register = register;
const registerPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const condition = yield (0, user_validate_1.valideRegiter)(req.body);
    if (condition) {
        try {
            const hashedPassword = yield argon2_1.default.hash(req.body.password);
            const data = {
                fullName: req.body.fullName,
                email: req.body.email,
                token: (0, generate_1.generateRandomString)(20),
                password: hashedPassword,
                status: "active"
            };
            const user = new user_model_1.default(data);
            yield user.save();
            res.cookie("tokenUser", user.token, {
                httpOnly: true,
                expires: new Date(Date.now() + 3600 * 1000 * 24 * 30),
                secure: true
            });
            req.flash("success", "Chúc mừng bạn đã đăng ký thành công");
            res.redirect("/");
        }
        catch (err) {
            req.flash("error", "Dữ liệu nhập vào không hợp lệ!");
            res.redirect(req.get("Referrer") || "/");
        }
    }
    else {
        req.flash("error", "Dữ liệu nhập vào không hợp lệ!");
        res.redirect(req.get("Referrer") || "/");
    }
});
exports.registerPost = registerPost;
const login = (req, res) => {
    res.render('client/pages/user/login', {
        pageTitle: 'Trang đăng nhập',
    });
};
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const condition = yield (0, user_validate_1.validateLogin)(req.body);
    if (condition) {
        try {
            const { email, password } = req.body;
            const userExist = yield user_model_1.default.findOne({
                email: email
            });
            if (!userExist) {
                throw new Error(`User ${email} does not exist`);
            }
            else {
                if (yield argon2_1.default.verify(userExist.password, password)) {
                    res.cookie("tokenUser", userExist.token, {
                        httpOnly: true,
                        expires: new Date(Date.now() + 3600 * 1000 * 24 * 30),
                        secure: true
                    });
                    req.flash("success", "Chúc mừng bạn đã đăng nhập thành công");
                    res.redirect("/");
                }
                else {
                    throw new Error("invalid");
                }
            }
        }
        catch (err) {
            req.flash("error", "Vui lòng nhập lại!");
            res.redirect(req.get("Referrer") || "/");
        }
    }
    else {
        req.flash("error", "Vui lòng nhập lại!");
        res.redirect(req.get("Referrer") || "/");
    }
});
exports.loginPost = loginPost;
const logout = (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect(req.get("Referrer") || "/");
};
exports.logout = logout;
const forgot = (req, res) => {
    res.render('client/pages/user/forgotPassword', {
        pageTitle: 'Trang gửi otp',
    });
};
exports.forgot = forgot;
const forgotPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if ((0, user_validate_1.isValidEmail)(email) && otp) {
        const valid = yield forgot_model_1.default.findOne({
            email: email,
            otp: otp
        });
        if (valid) {
            res.render('client/pages/user/changePassword', {
                pageTitle: 'Trang đổi mật khẩu',
                email: email
            });
        }
        else {
            res.redirect("back");
        }
    }
    else {
        res.redirect("back");
    }
});
exports.forgotPost = forgotPost;
const otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if ((0, user_validate_1.isValidEmail)(email)) {
        const user = yield user_model_1.default.findOne({
            email: email
        });
        if (!user) {
            res.json({
                code: 400,
                message: "Email không tồn tại"
            });
        }
        else {
            yield forgot_model_1.default.deleteMany({
                email: email
            });
            const otp = (0, generate_1.generateRandomNumber)(8);
            const forgotPassword = new forgot_model_1.default({
                email,
                otp
            });
            forgotPassword.save();
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
            const sent = yield (0, sendMail_1.default)(email, subject, html);
            if (sent) {
                res.json({
                    code: 200,
                    message: "OTP sent successfully"
                });
            }
            else {
                res.json({
                    code: 400,
                    message: "Mã OTP đã gửi không thành công vui lòng gửi lại!"
                });
            }
        }
    }
    else {
        res.json({
            code: 400,
            message: "Email không hợp lệ"
        });
    }
});
exports.otp = otp;
const change = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, passwordCheck } = req.body;
    if (password !== passwordCheck) {
        req.flash("error", "Mật khẩu không trùng khớp");
        res.redirect(req.get("Referrer") || "/");
    }
    if (password.length < 8 || password.length > 30) {
        req.flash("error", "Mật khẩu phải từ 8 đến 30 kí tự");
        res.redirect(req.get("Referrer") || "/");
    }
    if (!(0, user_validate_1.isValidEmail)(email)) {
        yield user_model_1.default.updateOne({
            email: email
        }, {
            password: yield argon2_1.default.hash(password)
        });
        const user = yield user_model_1.default.findOne({
            email: email
        });
        req.cookies.tokenUser = user === null || user === void 0 ? void 0 : user.token;
        req.flash("success", "Đổi mật khẩu thành công!");
        res.redirect('/');
    }
    else {
        req.flash("error", "Email không hợp lệ");
        res.redirect(req.get("Referrer") || "/");
    }
});
exports.change = change;
const info = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        status: "active",
        deleted: false,
        token: req.cookies.tokenUser,
    }).select("-password");
    const favorite = yield favorite_song_model_1.default.find({
        userId: user === null || user === void 0 ? void 0 : user._id,
    });
    res.render("client/pages/user/profile", {
        pageTitle: "My profile",
        user: user,
        favorite: favorite.length || 0
    });
});
exports.info = info;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email } = req.body;
    if (fullName) {
        if (fullName.length < 8 && fullName.length > 30) {
            res.json({
                code: 400,
                message: "Tên phải từ 8 đến 30 kí tự"
            });
        }
    }
    if (email) {
        if (!(0, user_validate_1.isValidEmail)(email)) {
            res.json({
                code: 400,
                message: "Email không hợp lệ"
            });
        }
    }
    yield user_model_1.default.updateOne({
        token: req.cookies.tokenUser
    }, req.body);
    res.json({
        code: 200,
        message: "Thành công",
        data: req.body
    });
});
exports.edit = edit;
