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
exports.deleteRole = exports.changeStatus = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const role_model_1 = __importDefault(require("../../model/role.model"));
const config_1 = require("../../config/config");
const account_model_1 = __importDefault(require("../../model/account.model"));
const account_validate_1 = require("../../validates/account.validate");
const argon2_1 = __importDefault(require("argon2"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const search_1 = require("../../helpers/search");
const filterStatus_1 = require("../../helpers/filterStatus");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterStatusHelper = (0, filterStatus_1.filterStatus)(req.query);
    let find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    const objectSearch = (0, search_1.search)(req.query);
    if (objectSearch.regex) {
        find.fullName = objectSearch.regex;
    }
    const totalSong = yield account_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItem: 5,
    }, req.query, totalSong);
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const key = req.query.sortKey;
        const value = req.query.sortValue;
        sort[key] = value;
    }
    else {
        sort.like = "desc";
    }
    const accounts = yield account_model_1.default.find(find)
        .skip(objectPagination.skip)
        .limit(objectPagination.limitItem)
        .sort(sort)
        .select("-password -token");
    for (let account of accounts) {
        const role = yield role_model_1.default.findOne({
            _id: account.role_id,
        });
        account.role = role === null || role === void 0 ? void 0 : role.title;
    }
    res.render("admin/pages/accounts/index", {
        titlePage: "Trang danh sách tài khoản",
        accounts: accounts || [],
        pagination: objectPagination,
        filterStatus: filterStatusHelper,
        keyword: objectSearch.keyword,
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
    if (condition) {
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
    if (condition) {
        if (req.body.password) {
            req.body.password = yield argon2_1.default.hash(req.body.password);
        }
        else {
            delete req.body.password;
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
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const status = req.body.status;
        if (!id) {
            throw new Error(`Invalid`);
        }
        yield account_model_1.default.updateOne({
            _id: id,
        }, {
            status: status,
        });
        res.json({
            code: 200,
            message: "Thay đổi trạng admin thành công",
        });
    }
    catch (error) {
        res.json({
            code: 500,
            message: "Thay đổi trạng thái admin thất bại",
        });
    }
});
exports.changeStatus = changeStatus;
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.json({
            code: 400,
            message: "Không tìm thấy nhóm quyền",
        });
    }
    yield account_model_1.default.updateOne({
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
