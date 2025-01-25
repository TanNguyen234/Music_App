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
exports.detail = exports.deleteTopic = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const topic_model_1 = __importDefault(require("../../model/topic.model"));
const validate_topic_validate_1 = require("../../validates/validate-topic.validate");
const config_1 = require("../../config/config");
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const search_1 = require("../../helpers/search");
const filterStatus_1 = require("../../helpers/filterStatus");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterStatusHelper = (0, filterStatus_1.filterStatus)(req.query);
    let find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    const objectSearch = (0, search_1.search)(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    const totalTopic = yield topic_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItem: 5,
    }, req.query, totalTopic);
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const key = req.query.sortKey;
        const value = req.query.sortValue;
        sort[key] = value;
    }
    else {
        sort.like = "desc";
    }
    const topics = yield topic_model_1.default.find({
        deleted: false,
    }).skip(objectPagination.skip).limit(objectPagination.limitItem).sort(sort);
    res.render("admin/pages/topics/index", {
        pageTitle: "Trang chủ đề",
        topics: topics || [],
        pagination: objectPagination,
        filterStatus: filterStatusHelper,
        keyword: objectSearch.keyword,
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/topics/create", {
        pageTitle: "Tạo chủ đề mới",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, validate_topic_validate_1.validateTopic)(req.body)) {
        const newTopic = new topic_model_1.default(req.body);
        yield newTopic.save();
        req.flash("success", "Tạo chủ đề mới thành công");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
    }
    else {
        req.flash("error", "Dữ liệu không hợp lệ");
        res.redirect("back");
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id) {
            throw new Error("Invalid");
        }
        const topic = yield topic_model_1.default.findById(req.params.id);
        if (!topic)
            throw new Error("id is invalid");
        res.render("admin/pages/topics/edit", {
            pageTitle: "Chỉnh sửa chủ đề",
            topic: topic || {},
        });
    }
    catch (error) {
        req.flash("error", "Chủ đề không tồn tại");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if ((0, validate_topic_validate_1.validateTopic)(req.body) && id) {
        try {
            yield topic_model_1.default.updateOne({
                _id: id,
            }, req.body);
            req.flash("success", "Chỉnh sửa chủ đề thành công");
            res.redirect("back");
        }
        catch (error) {
            req.flash("error", "Không tìm thấy chủ đề");
            res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
        }
    }
    else {
        req.flash("error", "Dữ liệu không hợp lệ");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.editPatch = editPatch;
const deleteTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (id) {
        try {
            yield topic_model_1.default.updateOne({
                _id: id,
            }, {
                deleted: true,
            });
            req.flash("success", "Xóa chủ đề thành công");
            res.redirect("back");
        }
        catch (error) {
            req.flash("error", "Xóa chủ đề thất bại");
            res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
        }
    }
    else {
        req.flash("error", "id không hợp lệ");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.deleteTopic = deleteTopic;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        if (!id)
            throw new Error('Invalid id');
        const topic = yield topic_model_1.default.findOne({
            _id: id,
            deleted: false,
        });
        if (topic) {
            res.render("admin/pages/topics/detail", {
                pageTitle: "Chi tiết chủ đề",
                topic: topic,
            });
        }
        else {
            throw new Error("Invalid");
        }
    }
    catch (error) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.detail = detail;
