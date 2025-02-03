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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.validateLogin = exports.valideRegiter = void 0;
exports.isValidEmail = isValidEmail;
const user_model_1 = __importDefault(require("../model/user.model"));
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const valideRegiter = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = data;
        if (!fullName || !email || !password || !isValidEmail(email)) {
            throw new Error("invalid");
        }
        if (fullName.length < 8 ||
            fullName.length > 20 ||
            password.length < 8 ||
            password.length > 20) {
            throw new Error("invalid");
        }
        const emailExist = yield user_model_1.default.findOne({
            email: email,
        });
        if (emailExist) {
            throw new Error("invalid");
        }
        else {
            return true;
        }
    }
    catch (err) {
        return false;
    }
});
exports.valideRegiter = valideRegiter;
const validateLogin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = data;
        if (!email || !password || !isValidEmail(email)) {
            throw new Error("invalid");
        }
        if (password.length < 8 ||
            password.length > 20) {
            throw new Error("invalid");
        }
        return true;
    }
    catch (err) {
        return false;
    }
});
exports.validateLogin = validateLogin;
const validateUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = data;
        if (!fullName || !email || !isValidEmail(email)) {
            throw new Error("invalid");
        }
        if (fullName.length < 8 ||
            fullName.length > 20 ||
            password.length < 8 ||
            password.length > 20) {
            throw new Error("invalid");
        }
        return true;
    }
    catch (err) {
        return false;
    }
});
exports.validateUser = validateUser;
