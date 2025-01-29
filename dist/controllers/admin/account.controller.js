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
exports.deleteRole = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const role_model_1 = __importDefault(require("../../model/role.model"));
const config_1 = require("../../config/config");
const account_model_1 = __importDefault(require("../../model/account.model"));
const account_validate_1 = require("../../validates/account.validate");
const argon2_1 = __importDefault(require("argon2"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false,
    };
    const accounts = yield account_model_1.default.find(find).select("-password -token");
    for (let account of accounts) {
        const role = yield role_model_1.default.findOne({
            _id: account.role_id,
        });
        account.role = role === null || role === void 0 ? void 0 : role.title;
    }
    res.render("admin/pages/accounts/index", {
        titlePage: "Trang danh sách tài khoản",
        accounts: accounts || [],
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield role_model_1.default.find({
        deleted: false,
    });
    res.render("admin/pages/accounts/create", {
        titlePage: "Tạo tài khoản mới",
        roles: roles || [],
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const condition = yield (0, account_validate_1.accountValidate)(req.body);
    console.log(condition, req.body);
    if (condition) {
        console.log(condition);
        req.body.password = yield argon2_1.default.hash(req.body.password);
        let account = new account_model_1.default(req.body);
        yield account.save();
        req.flash("success", "Thêm tài khoản thành công");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
    else {
        req.flash("error", "Tạo tài khoản thất bại");
        res.redirect(req.get("Referrer") || `/${config_1.systemConfig.prefixAdmin}/dashboard`);
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
    else {
        const account = yield account_model_1.default.findOne({
            _id: req.params.id,
            deleted: false,
        }).select("-token -password");
        if (!account) {
            req.flash("error", "Không tìm thấy nhóm quyền");
            res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
        }
        const roles = yield role_model_1.default.find({
            deleted: false,
        });
        res.render("admin/pages/accounts/edit", {
            titlePage: "Chỉnh sửa quyền",
            account: account,
            roles: roles || [],
        });
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const condition = yield (0, account_validate_1.accountEditValidate)(req.body);
    console.log(condition);
    if (condition) {
        if (req.body.password) {
            const admin = yield account_model_1.default.findOne({
                _id: req.params.id,
                deleted: false,
            }).select("password");
            const password = admin === null || admin === void 0 ? void 0 : admin.password;
            const passwordCheckChange = yield argon2_1.default.verify(password, req.body.password);
            if (!passwordCheckChange) {
                req.body.password = yield argon2_1.default.hash(req.body.password);
            }
        }
        yield account_model_1.default.updateOne({
            _id: req.params.id,
        }, req.body);
        req.flash("success", "Chỉnh sửa tài khoản thành công");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
    else {
        res.redirect(req.get("Referrer") || `/${config_1.systemConfig.prefixAdmin}/dashboard`);
    }
});
exports.editPatch = editPatch;
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.json({
            code: 400,
            message: "Không tìm thấy nhóm quyền",
        });
    }
    yield role_model_1.default.updateOne({
        _id: id,
    }, {
        deleted: true,
    });
    res.json({
        code: 200,
        message: "Xóa nhóm quyền thành công",
    });
});
exports.deleteRole = deleteRole;
