"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slug = require('mongoose-slug-updater');
mongoose_1.default.plugin(slug);
const songSchema = new mongoose_1.default.Schema({
    title: String,
    avatar: String,
    description: String,
    status: String,
    singerId: String,
    infoSinger: Object,
    topicId: String,
    like: {
        type: Number,
        default: 0
    },
    listen: {
        type: Number,
        default: 0
    },
    lyrics: String,
    audio: String,
    slug: { type: String, slug: "title", unique: true },
    createdBy: {
        account_id: String,
        create_at: {
            type: Date,
            default: Date.now()
        }
    },
    updatedBy: [
        {
            account_id: String,
            update_at: Date
        }
    ],
    deletedBy: {
        account_id: String,
        delete_at: Date
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, { timestamps: true });
const Song = mongoose_1.default.model("Song", songSchema, "songs");
exports.default = Song;
