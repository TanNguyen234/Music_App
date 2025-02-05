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
exports.eventSong = exports.listen = exports.index = void 0;
const topic_model_1 = __importDefault(require("../../model/topic.model"));
const song_model_1 = __importDefault(require("../../model/song.model"));
const user_model_1 = __importDefault(require("../../model/user.model"));
const favorite_song_model_1 = __importDefault(require("../../model/favorite-song.model"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id || "";
    var songs = null, topic = null;
    if (id) {
        topic = yield topic_model_1.default.findOne({
            _id: id,
            status: "active",
            deleted: false,
        });
        if (!topic) {
            req.flash("error", "id chủ đề không hợp lệ!");
            res.redirect("/topics");
        }
        else {
            songs = yield song_model_1.default.find({
                status: "active",
                topicId: id,
                deleted: false,
            });
        }
    }
    else {
        songs = yield song_model_1.default.find({
            status: "active",
            deleted: false,
        });
    }
    const totalSong = (songs === null || songs === void 0 ? void 0 : songs.length) || 0;
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItem: 10,
    }, req.query, totalSong);
    if (id) {
        songs = yield song_model_1.default.find({
            status: "active",
            topicId: id,
            deleted: false,
        })
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);
    }
    else {
        songs = yield song_model_1.default.find({
            status: "active",
            deleted: false,
        })
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);
    }
    const topics = yield topic_model_1.default.find({
        status: "active",
        deleted: false,
    }).select("title");
    res.render("client/pages/songs/song", {
        pageTitle: "Trang bài hát",
        objectPagination: objectPagination,
        topics: topics,
        topic: topic || null,
        songs: songs || [],
    });
});
exports.index = index;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (id) {
        const song = yield song_model_1.default.findOne({
            _id: id,
            status: "active",
            deleted: false,
        });
        if (!song) {
            req.flash("error", "id bài hát không hợp lệ!");
            res.redirect("/songs");
        }
        else {
            yield song_model_1.default.updateOne({
                _id: id,
            }, {
                listen: song.listen + 1,
            });
            var inPlayList = false;
            const checkInPlayList = yield user_model_1.default.findOne({
                token: req.cookies.tokenUser,
                playlist: { $in: [id] },
            });
            const user = yield user_model_1.default.findOne({
                token: req.cookies.tokenUser,
            });
            const favorite = yield favorite_song_model_1.default.findOne({
                userId: user === null || user === void 0 ? void 0 : user._id,
                songId: id,
            });
            if (checkInPlayList)
                inPlayList = true;
            res.render("client/pages/songs/listen", {
                pageTitle: "Nghe bài hát",
                song: song,
                inPlayList: inPlayList,
                favorite: favorite ? true : false,
            });
        }
    }
    else {
        res.redirect("/topics");
    }
});
exports.listen = listen;
const eventSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songId = req.params.id;
        const { type, value } = req.query;
        const song = yield song_model_1.default.findOne({
            _id: songId,
        });
        if (!song)
            throw new Error("");
        const like = song.like;
        switch (type) {
            case "like":
                const user = yield user_model_1.default.findOne({
                    token: req.cookies.tokenUser,
                });
                if (value === "favorite") {
                    yield song_model_1.default.updateOne({
                        _id: songId,
                    }, {
                        like: like + 1,
                    });
                    yield new favorite_song_model_1.default({
                        userId: user === null || user === void 0 ? void 0 : user._id,
                        songId: songId,
                    }).save();
                }
                else if (value === "unfavorite") {
                    yield song_model_1.default.updateOne({
                        _id: songId,
                    }, {
                        like: like - 1,
                    });
                    yield favorite_song_model_1.default.deleteOne({
                        userId: user === null || user === void 0 ? void 0 : user._id,
                        songId: songId,
                    });
                }
                break;
            case "playlist":
                if (value === "del") {
                    yield user_model_1.default.updateOne({
                        token: req.cookies.tokenUser,
                    }, {
                        $pull: {
                            playlist: songId,
                        },
                    });
                }
                else if (value === "push") {
                    yield user_model_1.default.updateOne({
                        token: req.cookies.tokenUser,
                    }, {
                        $push: {
                            playlist: songId,
                        },
                    });
                }
                break;
            default:
                break;
        }
        res.json({
            code: 200,
            like: value === "favorite" ? like + 1 : like - 1 < 0 ? 0 : like - 1
        });
    }
    catch (err) {
        res.json({
            code: 400,
        });
    }
});
exports.eventSong = eventSong;
