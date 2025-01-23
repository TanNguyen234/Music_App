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
exports.index = void 0;
const topic_model_1 = __importDefault(require("../../model/topic.model"));
const song_model_1 = __importDefault(require("../../model/song.model"));
const convertToSlug_1 = require("../../helpers/convertToSlug");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id || "";
    var songs = null, topic = null;
    const keyword = req.query.keyword || "";
    if (id || keyword) {
        if (id && keyword) {
            topic = yield topic_model_1.default.findOne({
                _id: id,
                status: "active",
                deleted: false,
            });
            if (!topic) {
                req.flash('error', "id chủ đề không hợp lệ!");
                res.redirect("/topics");
            }
            else {
                const keywordRegex = new RegExp(keyword, 'i');
                const slug = (0, convertToSlug_1.convertToSlug)(keyword);
                const slugRegex = new RegExp(slug, 'i');
                songs = yield song_model_1.default.find({
                    $or: [
                        { title: keywordRegex },
                        { slug: slugRegex }
                    ],
                    deleted: false
                });
            }
        }
        else if (id) {
            topic = yield topic_model_1.default.findOne({
                _id: id,
                status: "active",
                deleted: false,
            });
            if (!topic) {
                req.flash('error', "id chủ đề không hợp lệ!");
                res.redirect("/topics");
            }
            else {
                songs = yield song_model_1.default.find({
                    status: "active",
                    topicId: id,
                    deleted: false
                });
            }
        }
        else if (keyword) {
            const keywordRegex = new RegExp(keyword, 'i');
            const slug = (0, convertToSlug_1.convertToSlug)(keyword);
            const slugRegex = new RegExp(slug, 'i');
            songs = yield song_model_1.default.find({
                $or: [
                    { title: keywordRegex },
                    { slug: slugRegex }
                ],
                deleted: false
            });
        }
    }
    else {
        songs = yield song_model_1.default.find({
            status: "active",
            deleted: false,
        });
    }
    const topics = yield topic_model_1.default.find({
        status: "active",
        deleted: false
    }).select("title");
    res.json({
        code: 200,
        topics: topics,
        topic: topic || null,
        songs: songs || [],
    });
});
exports.index = index;
