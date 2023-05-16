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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateEmail = exports.validateName = void 0;
const EmailValidator = __importStar(require("email-validator"));
//* Validates user's name. Rules: Name must be at least 3 character long and must not include numbers or special characters
const validateName = (name) => {
    const nameRegex = new RegExp(/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/);
    return nameRegex.test(name); //* checks whether the entered name matches the specified condition and returns true or false accordingly
};
exports.validateName = validateName;
//* Validates user's email.
const validateEmail = (email) => {
    const result = EmailValidator.validate(email);
    console.log(result);
    return result;
    //* checks whether the entered email is valid or not and returns true or false accordingly
};
exports.validateEmail = validateEmail;
//* Validates user's password. Rules: Password must be at least 8 character long and it must include at least - one uppercase letter, one lowercase letter, one digit, one special character
const validatePassword = (password) => {
    const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
    return passwordRegex.test(password); //* checks whether the entered password matches the specified condition and returns true or false accordingly
};
exports.validatePassword = validatePassword;
