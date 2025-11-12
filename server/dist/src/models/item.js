"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchItems = exports.deleteItem = exports.updateItem = exports.createItem = exports.getItemById = exports.getAllItems = void 0;
const db_1 = __importDefault(require("../data/db"));
const getAllItems = () => {
    return (0, db_1.default)('items');
};
exports.getAllItems = getAllItems;
const getItemById = (id) => {
    return (0, db_1.default)('items').where({ id }).first();
};
exports.getItemById = getItemById;
const createItem = (item) => {
    return (0, db_1.default)('items').insert(item);
};
exports.createItem = createItem;
const updateItem = (id, item) => {
    return (0, db_1.default)('items').where({ id }).update(item);
};
exports.updateItem = updateItem;
const deleteItem = (id) => {
    return (0, db_1.default)('items').where({ id }).del();
};
exports.deleteItem = deleteItem;
const searchItems = (query) => {
    return (0, db_1.default)('items').where('name', 'like', `%${query}%`);
};
exports.searchItems = searchItems;
