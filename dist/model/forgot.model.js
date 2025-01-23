"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const forgotSchema = new mongoose_1.default.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        index: { expires: '3m' },
    },
}, { timestamps: true });
const Forgot = mongoose_1.default.model("Forgot", forgotSchema, "forgot-password");
exports.default = Forgot;
