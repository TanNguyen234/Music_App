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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloud = void 0;
const uploadToCloudinary_1 = require("../helpers/uploadToCloudinary");
const uploadToCloud = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (req.file) {
        const buffer = req.file.buffer;
        const mimetype = req.file.mimetype;
        const result = yield (0, uploadToCloudinary_1.uploadToCloudinary)(buffer, mimetype);
        req.body[req.file.fieldname] = result;
    }
    if (req.files && (req.files.avatar || req.files.audio)) {
        if (((_a = req.files.avatar) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            const avatar = req.files.avatar[0];
            const buffer = avatar.buffer;
            const mimetype = avatar.mimetype;
            const result = yield (0, uploadToCloudinary_1.uploadToCloudinary)(buffer, mimetype);
            req.body[avatar.fieldname] = result;
        }
        if (((_b = req.files.audio) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            const audio = req.files.audio[0];
            const buffer = audio.buffer;
            const mimetype = audio.mimetype;
            const result = yield (0, uploadToCloudinary_1.uploadToCloudinary)(buffer, mimetype);
            req.body[audio.fieldname] = result;
        }
    }
    next();
});
exports.uploadToCloud = uploadToCloud;
