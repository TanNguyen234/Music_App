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
exports.changeMulti = exports.changeStatus = exports.deleteSong = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const topic_model_1 = __importDefault(require("../../model/topic.model"));
const song_model_1 = __importDefault(require("../../model/song.model"));
const song_validate_1 = require("../../validates/song.validate");
const config_1 = require("../../config/config");
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const filterStatus_1 = require("../../helpers/filterStatus");
const search_1 = require("../../helpers/search");
const account_model_1 = __importDefault(require("../../model/account.model"));
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
        find.title = objectSearch.regex;
    }
    const totalSong = yield song_model_1.default.countDocuments(find);
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
    const songs = yield song_model_1.default.find(find)
        .skip(objectPagination.skip)
        .limit(objectPagination.limitItem)
        .sort(sort);
    for (const song of songs) {
        if (song.createdBy) {
            let admin = yield account_model_1.default.findOne({
                _id: song.createdBy.account_id,
            });
            if (admin) {
                song.accountFullNameCreated = admin.fullName;
            }
        }
        const updatedBy = song.updatedBy[song.updatedBy.length - 1];
        if (updatedBy) {
            const adminUpdated = yield account_model_1.default.findOne({
                _id: updatedBy.account_id,
            });
            song.accountFullNameUpdated = adminUpdated === null || adminUpdated === void 0 ? void 0 : adminUpdated.fullName;
        }
    }
    res.render("admin/pages/songs/index", {
        pageTitle: "Trang bài hát",
        songs: songs || [],
        pagination: objectPagination,
        filterStatus: filterStatusHelper,
        keyword: objectSearch.keyword,
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield topic_model_1.default.find({
        deleted: false,
    });
    res.render("admin/pages/songs/create", {
        pageTitle: "Tạo bài hát mới",
        topics: topics || [],
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.admin.permissions;
    if (!permissions.includes("song_create")) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/dashboard`);
        return;
    }
    if ((0, song_validate_1.validateSong)(req.body)) {
        req.body.createdBy = {
            account_id: res.locals.admin.id,
            delete_at: new Date(),
        };
        const newSong = new song_model_1.default(req.body);
        yield newSong.save();
        req.flash("success", "Tạo bài hát mới thành công");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
    }
    else {
        req.flash("error", "Dữ liệu không hợp lệ");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        if (!id) {
            throw new Error("id is invalid");
        }
        const song = yield song_model_1.default.findOne({
            _id: id,
        });
        if (!song) {
            throw new Error(`Song not found`);
        }
        const topics = yield topic_model_1.default.find({
            deleted: false,
        });
        res.render(`admin/pages/songs/edit`, {
            pageTitle: "Cập nhật bài hát",
            song: song,
            topics: topics,
        });
    }
    catch (error) {
        req.flash("error", "Bài hát không tồn tại!");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.admin.permissions;
    if (!permissions.includes("song_edit")) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/dashboard`);
        return;
    }
    const id = req.params.id;
    if ((0, song_validate_1.validateSong)(req.body) && id) {
        try {
            yield song_model_1.default.updateOne({
                _id: id,
            }, Object.assign(Object.assign({}, req.body), { $push: {
                    account_id: res.locals.user.id,
                    update_at: new Date(),
                } }));
            req.flash("success", "Chỉnh sửa bài hát thành công");
            res.redirect("back");
        }
        catch (error) {
            req.flash("error", "Không tìm thấy bài hát");
            res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
        }
    }
    else {
        req.flash("error", "Dữ liệu không hợp lệ");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
    }
});
exports.editPatch = editPatch;
const deleteSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = res.locals.admin.permissions;
        if (!permissions.includes("song_delete")) {
            res.redirect(`/${config_1.systemConfig.prefixAdmin}/dashboard`);
            throw new Error(`Invalid`);
        }
        const id = req.params.id;
        if (!id) {
            throw new Error(`Invalid`);
        }
        yield song_model_1.default.updateOne({
            _id: id,
        }, {
            deletedBy: {
                account_id: res.locals.admin.id,
                delete_at: new Date(),
            },
            deleted: true,
        });
        res.json({
            code: 200,
            message: "Xóa bài hát thành công",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Xóa bài hát thất bại",
        });
    }
});
exports.deleteSong = deleteSong;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = res.locals.admin.permissions;
        if (!permissions.includes("song_edit")) {
            res.redirect(`/${config_1.systemConfig.prefixAdmin}/dashboard`);
            throw new Error(`Invalid`);
        }
        const id = req.body.id;
        const status = req.body.status;
        if (!id) {
            throw new Error(`Invalid`);
        }
        yield song_model_1.default.updateOne({
            _id: id,
        }, {
            status: status,
        });
        res.json({
            code: 200,
            message: "Thay đổi trạng thái bài hát thành công",
        });
    }
    catch (error) {
        res.json({
            code: 500,
            message: "Thay đổi trạng thái bài hát thất bại",
        });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.admin.permissions;
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updated = {
        account_id: res.locals.admin.id,
        update_at: new Date(),
    };
    switch (type) {
        case "active":
            if (permissions.includes("song_edit")) {
                yield song_model_1.default.updateMany({ _id: { $in: ids } }, {
                    status: "active",
                    $push: { updatedBy: updated },
                });
                req.flash("success", `Đã cập nhật thành công trạng thái của ${ids.length} sản phẩm`);
            }
            break;
        case "inactive":
            if (permissions.includes("song_edit")) {
                yield song_model_1.default.updateMany({ _id: { $in: ids } }, {
                    status: "inactive",
                    $push: { updatedBy: updated },
                });
                req.flash("success", `Đã cập nhật thành công trạng thái của ${ids.length} sản phẩm`);
            }
            break;
        case "delete-all":
            if (permissions.includes("song_delete")) {
                yield song_model_1.default.updateMany({ _id: { $in: ids } }, { deleted: true, deletedBy: updated });
                req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm`);
            }
            break;
        default:
            break;
    }
    res.redirect("back");
});
exports.changeMulti = changeMulti;
