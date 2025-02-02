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
exports.permissionPost = exports.permission = exports.deleteRole = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const role_model_1 = __importDefault(require("../../model/role.model"));
const role_validate_1 = require("../../validates/role.validate");
const config_1 = require("../../config/config");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    const roles = yield role_model_1.default.find(find);
    res.render("admin/pages/roles/index", {
        titlePage: "Nhóm quyền",
        roles: roles || []
    });
});
exports.index = index;
const create = (req, res) => {
    res.render("admin/pages/roles/create", {
        titlePage: "Tạo quyền",
    });
};
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, role_validate_1.roleValidate)(req.body)) {
        let role = new role_model_1.default(req.body);
        yield role.save();
        req.flash("success", "Thêm nhóm quyền thành công");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/roles`);
    }
    else {
        res.redirect(req.get("Referrer") || `/${config_1.systemConfig.prefixAdmin}/dashboard`);
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/roles`);
    }
    else {
        const role = yield role_model_1.default.findOne({
            _id: req.params.id,
            deleted: false
        });
        if (!role) {
            req.flash("error", "Không tìm thấy nhóm quyền");
            res.redirect(`/${config_1.systemConfig.prefixAdmin}/roles`);
        }
        res.render("admin/pages/roles/edit", {
            titlePage: "Chỉnh sửa quyền",
            role: role
        });
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, role_validate_1.roleValidate)(req.body)) {
        yield role_model_1.default.updateOne({
            _id: req.params.id
        }, req.body);
        req.flash("success", "Chỉnh sửa nhóm quyền thành công");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/roles`);
    }
    else {
        res.redirect(req.get("Referrer") || `/${config_1.systemConfig.prefixAdmin}/dashboard`);
    }
});
exports.editPatch = editPatch;
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const permisions = res.locals.admin.permisions;
    if (!id || !permisions.includes("roles_delete")) {
        res.json({
            code: 400,
            message: "Không tìm thấy nhóm quyền"
        });
    }
    else {
        yield role_model_1.default.updateOne({
            _id: id
        }, {
            deleted: true
        });
        res.json({
            code: 200,
            message: "Xóa nhóm quyền thành công"
        });
    }
});
exports.deleteRole = deleteRole;
const permission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    const records = yield role_model_1.default.find(find);
    res.render("admin/pages/roles/permission", {
        titlePage: "Phân quyền",
        roles: records || []
    });
});
exports.permission = permission;
const permissionPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body)
            throw new Error('Dữ liệu không hợp lệ!');
        for (let item of req.body) {
            yield role_model_1.default.updateOne({
                _id: item.id
            }, {
                permissions: item.permissions
            });
        }
        res.json({
            code: 200,
            message: "Cập nhật phân quyền thành công!"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Có lỗi xảy ra vui lòng thử lại!"
        });
    }
});
exports.permissionPost = permissionPost;
