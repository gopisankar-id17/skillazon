const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Database connection
const connectDB = require('./config/database');

// Route imports
const skillRoutes = require('./routes/skills');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.API_PORT || 3004;

// Initialize database connection
let dbConnected = false;
const initDB = async () => {
  const connection = await connectDB();
  dbConnected = connection !== false;
  if (!dbConnected) {
    console.log('⚠️  Running in fallback mode with limited functionality');
  }
};

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Skillazon API Server is running',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'Connected' : 'Disconnected',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/skills', skillRoutes);
app.use('/api/bookings', bookingRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
const startServer = async () => {
  try {
    await initDB();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Skillazon API Server running on port ${PORT}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`💾 Database: ${dbConnected ? 'MongoDB Connected' : 'Disconnected'}`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start API server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
