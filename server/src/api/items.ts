import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads - CHANGED TO MEMORY STORAGE
const storage = multer.memoryStorage(); // Store in memory instead of disk

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Define proper TypeScript interfaces
interface ListingImage {
  image_url: string;
}

interface Profile {
  username: string;
  trust_score: number;
  successful_reunions: number;
}

interface Item {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location: string;
  date_lost_or_found: string;
  is_valuable: boolean;
  created_at: string;
  profiles: Profile;
  listing_images: ListingImage[];
}

// Mock database (replace with your actual database)
let items: Item[] = [];

// GET /api/items - Get all items
router.get('/', (req: express.Request, res: express.Response) => {
  try {
    console.log('GET /api/items - Returning', items.length, 'items');
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// POST /api/items - Create new item with images - UPDATED FOR BASE64
router.post('/', upload.array('images', 5), (req: express.Request, res: express.Response) => {
  try {
    console.log('POST /api/items - Received data:', req.body);
    console.log('Files received:', req.files);

    const { type, title, description, category, location, date, is_valuable, user_id } = req.body;

    // Validate required fields
    if (!title || !description || !category || !location || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Handle files safely - CHANGED TO BASE64
    const files = req.files as Express.Multer.File[] | undefined;
    const listing_images: ListingImage[] = files 
      ? files.map(file => ({
          image_url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
        }))
      : [];

    // Create new item
    const newItem: Item = {
      id: Date.now().toString(),
      type: (type as 'lost' | 'found') || 'lost',
      title,
      description,
      category,
      location,
      date_lost_or_found: date,
      is_valuable: is_valuable === 'true',
      created_at: new Date().toISOString(),
      profiles: {
        username: 'Current User', // Replace with actual user data
        trust_score: 0,
        successful_reunions: 0
      },
      listing_images
    };

    // Add to mock database
    items.unshift(newItem); // Add to beginning of array

    console.log('New item created with', listing_images.length, 'images');
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Serve uploaded files statically (keep this for future use)
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

export default router;