"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const multer = require("multer");
const router = (0, express_1.Router)();
const upload = multer();
const controller = __importStar(require("../../controllers/admin/auth.controller"));
const middleware = __importStar(require("../../middlewares/uploadToCloud.middleware"));
const CustomRequest_1 = require("../../interface/CustomRequest");
const authAdmin_middleware_1 = require("../../middlewares/authAdmin.middleware");
router.get("/login", controller.login);
router.post("/login", (0, CustomRequest_1.returnCustomRequest)(controller.loginPost));
router.get("/logout", controller.logout);
router.get("/profile", authAdmin_middleware_1.requireAuthAdmin, (0, CustomRequest_1.returnCustomRequest)(controller.profile));
router.patch("/profile", authAdmin_middleware_1.requireAuthAdmin, upload.single("avatar"), (0, CustomRequest_1.returnCustomRequest)(middleware.uploadToCloud), (0, CustomRequest_1.returnCustomRequest)(controller.profilePatch));
exports.authRoutes = router;
