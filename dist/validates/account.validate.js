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
exports.accountEditValidate = exports.accountValidate = void 0;
const account_model_1 = __importDefault(require("../model/account.model"));
const user_validate_1 = require("./user.validate");
const accountValidate = (Data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(Data, !(0, user_validate_1.isValidEmail)(Data.email));
    if (!Data.fullName || !(0, user_validate_1.isValidEmail)(Data.email) || !Data.password || !Data.role_id) {
        return false;
    }
    const emailExist = yield account_model_1.default.findOne({
        email: Data.email,
        deleted: false
    });
    if (emailExist) {
        return false;
    }
    return true;
});
exports.accountValidate = accountValidate;
const accountEditValidate = (Data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Data.fullName || !(0, user_validate_1.isValidEmail)(Data.email) || !Data.role_id) {
        return false;
    }
    return true;
});
exports.accountEditValidate = accountEditValidate;
