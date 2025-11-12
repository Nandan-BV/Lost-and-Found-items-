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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../data/db")); // Your Knex database connection
const router = express_1.default.Router();
// GET /api/items - Fetch all items
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield (0, db_1.default)('items').select('*').orderBy('created_at', 'desc');
        res.status(200).json(items);
    }
    catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items' });
    }
}));
// POST /api/items - Add a new item
// NOTE: I've removed `authenticateToken` for now to make testing easier.
// We can add it back later.
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, is_lost } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Item name is required.' });
        }
        // We'll hardcode a user_id for now. In a real app, this would come
        // from the authenticated user's token.
        const user_id = 1;
        const [newItem] = yield (0, db_1.default)('items')
            .insert({ name, description, is_lost: !!is_lost, user_id })
            .returning('*'); // Return the newly created item
        res.status(201).json(newItem);
    }
    catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ message: 'Error adding new item' });
    }
}));
exports.default = router;
