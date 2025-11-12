import express from 'express';

const router = express.Router();

// Mock user data (replace with your actual database)
const mockUsers = [
  {
    id: '1',
    username: 'demo@example.com',
    email: 'demo@example.com',
    password: 'password' // In real app, this would be hashed
  }
];

// Mock functions (replace with your actual implementations)
const createUser = async (userData: any) => {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const newUser = {
    id: (mockUsers.length + 1).toString(),
    username: userData.email || userData.username,
    email: userData.email,
    password: userData.password // In real app, hash this password
  };
  
  mockUsers.push(newUser);
  return newUser;
};

const findUserByUsername = async (username: string) => {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockUsers.find(user => 
    user.username === username || user.email === username
  );
};

const comparePasswords = async (plainPassword: string, hashedPassword: string) => {
  // In real app, use bcrypt.compare()
  return plainPassword === hashedPassword;
};

const generateToken = (user: any) => {
  // In real app, use jsonwebtoken
  return 'mock-jwt-token-' + user.id;
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await findUserByUsername(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await createUser({ email, password, username: email });
    const token = generateToken(user);
    
    res.status(201).json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering new user' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await findUserByUsername(username);

    if (user && await comparePasswords(password, user.password)) {
      const token = generateToken(user);
      res.json({ 
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Test endpoint to check if auth is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth API is working!' });
});

export default router;
