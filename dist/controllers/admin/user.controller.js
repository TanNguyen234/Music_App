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
exports.deleteUser = exports.changeStatus = exports.editPatch = exports.edit = exports.index = void 0;
const config_1 = require("../../config/config");
const argon2_1 = __importDefault(require("argon2"));
const user_model_1 = __importDefault(require("../../model/user.model"));
const user_validate_1 = require("../../validates/user.validate");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false,
    };
    const users = yield user_model_1.default.find(find);
    res.render("admin/pages/users/index", {
        titlePage: "Trang danh sách tài khoản",
        users: users || [],
    });
});
exports.index = index;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
    else {
        const user = yield user_model_1.default.findOne({
            _id: req.params.id,
            deleted: false,
        }).select("-token -password");
        if (!user) {
            req.flash("error", "Không tìm thấy tài khoản người dùng");
            res.redirect(`/${config_1.systemConfig.prefixAdmin}/users`);
        }
        res.render("admin/pages/users/edit", {
            titlePage: "Chỉnh sửa quyền",
            user
        });
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const condition = yield (0, user_validate_1.valideRegiter)(req.body);
    if (condition) {
        if (req.body.password) {
            req.body.password = yield argon2_1.default.hash(req.body.password);
        }
        else {
            delete req.body.password;
        }
        yield user_model_1.default.updateOne({
            _id: req.params.id,
        }, req.body);
        req.flash("success", "Chỉnh sửa tài khoản thành công");
        req.get("Referrer") || `/${config_1.systemConfig.prefixAdmin}/users`;
    }
    else {
        res.redirect(req.get("Referrer") || `/${config_1.systemConfig.prefixAdmin}/users`);
    }
});
exports.editPatch = editPatch;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const status = req.body.status;
        if (!id) {
            throw new Error(`Invalid`);
        }
        yield user_model_1.default.updateOne({
            _id: id,
        }, {
            status: status,
        });
        res.json({
            code: 200,
            message: "Thay đổi trạng người dùng thành công",
        });
    }
    catch (error) {
        res.json({
            code: 500,
            message: "Thay đổi trạng thái người dùng thất bại",
        });
    }
});
exports.changeStatus = changeStatus;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.json({
            code: 400,
            message: "Không tìm thấy nhóm quyền",
        });
    }
    yield user_model_1.default.updateOne({
        _id: id,
    }, {
        deleted: true,
    });
    res.json({
        code: 200,
        message: "Xóa nhóm quyền thành công",
    });
});
exports.deleteUser = deleteUser;
