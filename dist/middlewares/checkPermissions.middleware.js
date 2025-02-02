"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const checkPermission = (type, permission) => {
    return (req, res, next) => {
        const permissions = res.locals.role.permissions;
        console.log(permissions);
        if (!permissions.includes(permission)) {
            if (type === "render") {
                res.render("admin/partials/403.pug");
            }
            else if (type === "json") {
                return res.json({
                    code: 403,
                    message: "Bạn không có quyền thực hiện hành động này"
                });
            }
        }
        next();
    };
};
exports.checkPermission = checkPermission;
