"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTopic = void 0;
const validateTopic = (Data) => {
    console.log(Data.title, Data.status);
    if (!Data.title) {
        return false;
    }
    if (!Data.status) {
        return false;
    }
    return true;
};
exports.validateTopic = validateTopic;
