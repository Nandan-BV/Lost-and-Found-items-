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
exports.createUser = exports.findUserByUsername = void 0;
const db_1 = __importDefault(require("../data/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const findUserByUsername = (username) => {
    return (0, db_1.default)('users').where({ username }).first();
};
exports.findUserByUsername = findUserByUsername;
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = user;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    return (0, db_1.default)('users').insert({ username, password: hashedPassword });
});
exports.createUser = createUser;
