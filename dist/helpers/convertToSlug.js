"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToSlug = void 0;
const unidecode = require('unidecode');
const convertToSlug = (text) => {
    const unidecodeText = unidecode(text.trim());
    const slug = unidecodeText.replace(/\s+/g, "-");
    return slug;
};
exports.convertToSlug = convertToSlug;
