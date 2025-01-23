"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSong = void 0;
const validateSong = (Data) => {
    if (!Data.title) {
        return false;
    }
    if (Data.status !== 'active' && Data.status !== 'inactive') {
        return false;
    }
    if (!Data.topicId) {
        return false;
    }
    return true;
};
exports.validateSong = validateSong;
