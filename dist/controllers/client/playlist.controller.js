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
const song_model_1 = __importDefault(require("../../model/song.model"));
const user_model_1 = __importDefault(require("../../model/user.model"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({
            status: "active",
            deleted: false,
            token: req.cookies.tokenUser,
        });
        var songs = [];
        const listIdPlaylist = (user === null || user === void 0 ? void 0 : user.playlist) || [];
        songs = yield song_model_1.default.find({
            _id: { $in: listIdPlaylist },
            status: "active"
        });
        const totalSong = (songs === null || songs === void 0 ? void 0 : songs.length) || 0;
        let objectPagination = (0, pagination_1.default)({
            currentPage: 1,
            limitItem: 20,
        }, req.query, totalSong);
        songs = yield song_model_1.default.find({
            status: "active",
            _id: { $in: listIdPlaylist },
            deleted: false,
        })
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);
        res.render("client/pages/playlist/playlist", {
            pageTitle: "My playlist",
            songs: songs,
            pagination: objectPagination
        });
    }
    catch (err) {
        console.log("error: ", err);
        res.redirect("client/pages/errors/404.pug");
    }
});
exports.index = index;
