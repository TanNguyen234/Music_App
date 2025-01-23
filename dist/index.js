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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const methodOverride = require('method-override');
const moment_1 = __importDefault(require("moment"));
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const database = __importStar(require("./config/database"));
const config_1 = require("./config/config");
const index_route_1 = __importDefault(require("./routes/client/index.route"));
const index_route_2 = __importDefault(require("./routes/admin/index.route"));
dotenv_1.default.config();
database.connect();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use("/tinymce", express_1.default.static(path_1.default.join(__dirname, "node_modules", "tinymce")));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path_1.default.join(__dirname, 'views'));
app.locals.prefixAdmin = config_1.systemConfig.prefixAdmin;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser("YSUDGSGDJSGDJ"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
(0, index_route_1.default)(app);
(0, index_route_2.default)(app);
app.locals.prefixAdmin = config_1.systemConfig.prefixAdmin;
app.locals.moment = moment_1.default;
app.get('*', (req, res) => {
    res.render('client/pages/errors/404', {
        titlePage: '404 Not Found',
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
