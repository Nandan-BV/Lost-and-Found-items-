"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.comparePasswords = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const comparePasswords = (password, hash) => {
    return bcrypt_1.default.compare(password, hash);
};
exports.comparePasswords = comparePasswords;
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
};
exports.generateToken = generateToken;
