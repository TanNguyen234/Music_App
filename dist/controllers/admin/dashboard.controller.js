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
const account_model_1 = __importDefault(require("../../model/account.model"));
const user_model_1 = __importDefault(require("../../model/user.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var statistic = {
        topics: {
            total: 0,
            active: 0,
            inactive: 0
        },
        songs: {
            total: 0,
            active: 0,
            inactive: 0
        },
        accounts: {
            total: 0,
            active: 0,
            inactive: 0
        },
        users: {
            total: 0,
            active: 0,
            inactive: 0
        }
    };
    statistic.topics.total = yield topic_model_1.default.countDocuments({
        deleted: false
    });
    statistic.songs.total = yield song_model_1.default.countDocuments({
        deleted: false
    });
    statistic.accounts.total = yield account_model_1.default.countDocuments({
        deleted: false
    });
    statistic.users.total = yield user_model_1.default.countDocuments({
        deleted: false
    });
    statistic.topics.active = yield topic_model_1.default.countDocuments({
        deleted: false,
        status: 'active'
    });
    statistic.songs.active = yield song_model_1.default.countDocuments({
        deleted: false,
        status: 'active'
    });
    statistic.accounts.active = yield account_model_1.default.countDocuments({
        deleted: false,
        status: 'active'
    });
    statistic.users.active = yield user_model_1.default.countDocuments({
        deleted: false,
        status: 'active'
    });
    statistic.topics.inactive = yield topic_model_1.default.countDocuments({
        deleted: false,
        status: 'inactive'
    });
    statistic.songs.inactive = yield song_model_1.default.countDocuments({
        deleted: false,
        status: 'inactive'
    });
    statistic.accounts.inactive = yield account_model_1.default.countDocuments({
        deleted: false,
        status: 'inactive'
    });
    statistic.users.inactive = yield user_model_1.default.countDocuments({
        deleted: false,
        status: 'inactive'
    });
    res.render('admin/pages/dashboard/index', {
        pageTitle: 'Trang Chủ',
        statistic: statistic
    });
});
exports.index = index;
