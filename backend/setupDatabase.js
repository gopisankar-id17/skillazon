#!/usr/bin/env node

/**
 * Skillazon Database Setup Script
 * 
 * This script helps set up the MongoDB database for the Skillazon authentication system.
 * It creates the necessary collections and indexes.
 */

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const setupDatabase = async () => {
  try {
    console.log('🚀 Starting Skillazon Database Setup...\n');

    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillazon';
    console.log(`📊 Connecting to MongoDB: ${mongoURI}`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB successfully\n');

    // Create collections and indexes
    console.log('🔧 Setting up collections and indexes...');
    
    // Ensure User collection exists with proper indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ createdAt: 1 });
    await User.collection.createIndex({ lastLogin: 1 });

    console.log('✅ User collection indexes created');

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('👑 Creating default admin user...');
      
      const adminUser = new User({
        username: 'admin',
        email: 'admin@skillazon.com',
        password: 'admin123', // Will be hashed automatically
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      });

      await adminUser.save();
      console.log('✅ Default admin user created');
      console.log('   📧 Email: admin@skillazon.com');
      console.log('   🔑 Password: admin123');
      console.log('   ⚠️  Please change the admin password after first login!\n');
    } else {
      console.log('ℹ️  Admin user already exists\n');
    }

    // Display database statistics
    const userCount = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminCount = await User.countDocuments({ role: 'admin' });

    console.log('📊 Database Statistics:');
    console.log(`   👥 Total Users: ${userCount}`);
    console.log(`   ✅ Active Users: ${activeUsers}`);
    console.log(`   👑 Admin Users: ${adminCount}`);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('🔐 Authentication server is ready to use');
    console.log('🌐 Start the auth server with: node server/authServer.js');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Database connection closed');
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
