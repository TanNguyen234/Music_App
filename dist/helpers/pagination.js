"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination = (objectPagination, query, countProducts) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }
    objectPagination.skip = ((objectPagination.currentPage - 1) * objectPagination.limitItem);
    const totalPage = Math.ceil(countProducts / objectPagination.limitItem);
    objectPagination.totalPage = totalPage;
    return objectPagination;
};
exports.default = pagination;
