const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Database connection
const connectDB = require('./config/database');
const User = require('./models/User');

const app = express();

// Initialize database connection
let dbConnected = false;
const initDB = async () => {
  const connection = await connectDB();
  dbConnected = connection !== false;
  if (!dbConnected) {
    console.log('⚠️  Running in fallback mode with in-memory storage');
  }
};

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Fallback in-memory storage (when database is not available)
let users = [];
let refreshTokens = [];

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Helper functions
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id || user.id, 
      email: user.email, 
      username: user.username,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user._id || user.id, 
      email: user.email 
    },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    let existingUser;
    
    if (dbConnected) {
      // Check if user already exists in database
      existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });
    } else {
      // Check in-memory storage
      existingUser = users.find(u => u.email === email || u.username === username);
    }

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email or username' });
    }

    let newUser;
    
    if (dbConnected) {
      // Create user in database
      newUser = new User({
        username,
        email,
        password // Will be hashed by the pre-save middleware
      });
      
      await newUser.save();
    } else {
      // Create user in memory
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      newUser = {
        id: Date.now().toString(),
        username,
        email,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
    }

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    
    if (!dbConnected) {
      refreshTokens.push(refreshToken);
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id || newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let user;
    
    if (dbConnected) {
      // Find user in database
      user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password using model method
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Find user in memory
      user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    if (!dbConnected) {
      refreshTokens.push(refreshToken);
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const userData = users.find(u => u.id === user.id);
    if (!userData) {
      return res.status(403).json({ error: 'User not found' });
    }

    const accessToken = generateAccessToken(userData);
    res.json({ accessToken });
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  }
  
  res.json({ message: 'Logout successful' });
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update username and email
    if (username) {
      const existingUser = users.find(u => u.username === username && u.id !== userId);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      user.username = username;
    }

    if (email) {
      const existingUser = users.find(u => u.email === email && u.id !== userId);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already taken' });
      }
      user.email = email;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const userList = users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }));

  res.json({ users: userList });
});

// Server info
app.get('/api/auth/info', (req, res) => {
  res.json({
    message: 'Skillazon Authentication Server',
    version: '1.0.0',
    totalUsers: users.length,
    activeTokens: refreshTokens.length
  });
});

const PORT = process.env.PORT || 3003;

// Initialize server with database connection
const startServer = async () => {
  try {
    // Initialize database
    await initDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n🔐 Skillazon Auth Server running on port ${PORT}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api/auth`);
      console.log(`📊 Server Info: http://localhost:${PORT}/api/auth/info`);
      console.log(`� Database: ${dbConnected ? 'MongoDB Connected' : 'In-Memory Storage'}`);
      console.log(`� Storage Mode: ${dbConnected ? 'Persistent' : 'Session-based'}`);
      console.log(`🔑 JWT Expiry: Access=${JWT_EXPIRES_IN}, Refresh=${JWT_REFRESH_EXPIRES_IN}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
