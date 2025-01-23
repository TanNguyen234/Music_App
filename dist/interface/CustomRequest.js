"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnCustomRequest = void 0;
const returnCustomRequest = (expended) => {
    return (req, res, next) => {
        expended(req, res, next).catch(next);
    };
};
exports.returnCustomRequest = returnCustomRequest;
