"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleValidate = void 0;
const roleValidate = (Data) => {
    if (!Data.title || !Data.description) {
        return false;
    }
    return true;
};
exports.roleValidate = roleValidate;
