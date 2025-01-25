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
exports.deleteSong = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const topic_model_1 = __importDefault(require("../../model/topic.model"));
const song_model_1 = __importDefault(require("../../model/song.model"));
const song_validate_1 = require("../../validates/song.validate");
const config_1 = require("../../config/config");
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    const totalTopic = yield song_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItem: 5,
    }, req.query, totalTopic);
    const songs = yield song_model_1.default.find({
        deleted: false,
    }).skip(objectPagination.skip).limit(objectPagination.limitItem);
    res.render("admin/pages/songs/index", {
        pageTitle: "Trang bài hát",
        songs: songs || [],
        pagination: objectPagination,
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
    if ((0, song_validate_1.validateSong)(req.body)) {
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
    const id = req.params.id;
    if ((0, song_validate_1.validateSong)(req.body) && id) {
        try {
            yield song_model_1.default.updateOne({
                _id: id,
            }, req.body);
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
    const id = req.params.id;
    try {
        if (!id) {
            throw new Error(`Invalid`);
        }
        yield song_model_1.default.updateOne({
            _id: id,
        }, {
            deleted: true,
        });
        req.flash("success", "Xóa bài hát thành công");
        res.redirect("back");
    }
    catch (error) {
        req.flash("error", "Xóa bài hát thất bại");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
    }
});
exports.deleteSong = deleteSong;
