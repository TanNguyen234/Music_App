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
exports.profilePatch = exports.profile = exports.logout = exports.loginPost = exports.login = void 0;
const user_validate_1 = require("../../validates/user.validate");
const argon2_1 = __importDefault(require("argon2"));
const config_1 = require("../../config/config");
const account_model_1 = __importDefault(require("../../model/account.model"));
const login = (req, res) => {
    res.render('admin/pages/auth/login', {
        pageTitle: 'Trang đăng nhập',
    });
};
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const condition = yield (0, user_validate_1.validateLogin)(req.body);
    if (condition) {
        try {
            const { email, password } = req.body;
            const userExist = yield account_model_1.default.findOne({
                email: email
            });
            if (!userExist) {
                throw new Error(`Admin ${email} does not exist`);
            }
            else {
                if (yield argon2_1.default.verify(userExist.password, password)) {
                    res.cookie("tokenAdmin", userExist.token, {
                        httpOnly: true,
                        expires: new Date(Date.now() + 3600 * 1000 * 24 * 30),
                        secure: true
                    });
                    req.flash("success", "Chúc mừng bạn đã đăng nhập thành công");
                    res.redirect(`/${config_1.systemConfig.prefixAdmin}/dashboard`);
                }
                else {
                    throw new Error("invalid");
                }
            }
        }
        catch (err) {
            req.flash("error", "Vui lòng nhập lại!");
            res.redirect(req.get("Referrer") || `/${config_1.systemConfig.prefixAdmin}/dashboard`);
        }
    }
    else {
        req.flash("error", "Vui lòng nhập lại!");
        res.redirect(req.get("Referrer") || `/${config_1.systemConfig.prefixAdmin}/dashboard`);
    }
});
exports.loginPost = loginPost;
const logout = (req, res) => {
    res.clearCookie("tokenAdmin");
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/dashboard`);
};
exports.logout = logout;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/auth/profile.pug", {
        pageTitle: 'Trang thông tin tài khoản'
    });
});
exports.profile = profile;
const profilePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, phone, avatar } = req.body;
    let saveData = {};
    if (fullName) {
        if (fullName.length < 8 && fullName.length > 30) {
            res.json({
                code: 400,
                message: "Tên phải từ 8 đến 30 kí tự"
            });
        }
        else {
            saveData.fullName = fullName;
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
    if (phone) {
        if (phone.length !== 10) {
            res.json({
                code: 400,
                message: "Số điện thoại phải có 10 chữ số"
            });
        }
    }
    if (avatar)
        saveData.avatar = avatar;
    yield account_model_1.default.updateOne({
        token: req.cookies.tokenAdmin
    }, saveData);
    res.json({
        code: 200,
        message: "Thành công",
        data: saveData
    });
});
exports.profilePatch = profilePatch;
