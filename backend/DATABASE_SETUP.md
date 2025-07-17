# Skillazon Database Setup Guide

## Overview
This guide explains how to set up and configure the MongoDB database for the Skillazon authentication system.

## Prerequisites

### 1. MongoDB Installation
Choose one of the following options:

#### Option A: Local MongoDB Installation
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB following the official documentation
3. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string and replace the `MONGODB_URI` in `.env`

### 2. Environment Configuration
1. Copy the `.env` file in the `server` directory
2. Update the MongoDB connection string:
   ```env
   # For local MongoDB
   MONGODB_URI=mongodb://localhost:27017/skillazon
   
   # For MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillazon
   ```

## Database Setup

### Automatic Setup (Recommended)
Run the setup script to automatically configure the database:

```bash
cd server
node setupDatabase.js
```

This script will:
- Create the `skillazon` database
- Set up the `users` collection with proper indexes
- Create a default admin user
- Display database statistics

### Manual Setup
If you prefer manual setup:

1. Connect to MongoDB:
   ```bash
   mongosh mongodb://localhost:27017/skillazon
   ```

2. Create indexes:
   ```javascript
   db.users.createIndex({ email: 1 }, { unique: true })
   db.users.createIndex({ username: 1 }, { unique: true })
   db.users.createIndex({ createdAt: 1 })
   db.users.createIndex({ lastLogin: 1 })
   ```

## Database Schema

### User Collection
The `users` collection stores user authentication data:

```javascript
{
  _id: ObjectId,
  username: String,        // Unique username
  email: String,           // Unique email address
  password: String,        // Hashed password (bcrypt)
  role: String,            // 'user' or 'admin'
  firstName: String,       // Optional first name
  lastName: String,        // Optional last name
  isActive: Boolean,       // Account status
  createdAt: Date,         // Account creation date
  lastLogin: Date,         // Last login timestamp
  loginAttempts: Number,   // Failed login attempts
  lockoutExpires: Date     // Account lockout expiry
}
```

### Indexes
- `email`: Unique index for email lookups
- `username`: Unique index for username lookups
- `createdAt`: Index for sorting by creation date
- `lastLogin`: Index for activity queries

## Configuration Options

### Environment Variables
Configure these variables in your `.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/skillazon

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_SALT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCKOUT_HOURS=1
```

### Connection Options
The database connection uses these options:
- `maxPoolSize`: 10 connections
- `serverSelectionTimeoutMS`: 5000ms
- `socketTimeoutMS`: 45000ms
- `family`: 4 (IPv4)

## Starting the Server

### Development Mode
```bash
cd server
node authServer.js
```

### Production Mode
```bash
cd server
NODE_ENV=production node authServer.js
```

## Default Admin User
The setup script creates a default admin user:
- **Email**: admin@skillazon.com
- **Password**: admin123
- **Role**: admin

⚠️ **Important**: Change the admin password after first login!

## Troubleshooting

### Connection Issues
1. **MongoDB not running**: Ensure MongoDB service is started
2. **Connection string**: Verify the `MONGODB_URI` in `.env`
3. **Network issues**: Check firewall and network connectivity

### Authentication Issues
1. **Invalid credentials**: Verify user exists in database
2. **JWT errors**: Check JWT secrets in `.env`
3. **Token expiry**: Tokens expire after 15 minutes (configurable)

### Database Issues
1. **Index errors**: Run `db.users.getIndexes()` to check indexes
2. **Duplicate key**: Check for existing users with same email/username
3. **Validation errors**: Ensure all required fields are provided

## Database Commands

### Useful MongoDB Commands
```javascript
// Connect to database
use skillazon

// List all users
db.users.find().pretty()

// Find user by email
db.users.findOne({ email: "user@example.com" })

// Count total users
db.users.countDocuments()

// Find admin users
db.users.find({ role: "admin" })

// Delete user
db.users.deleteOne({ email: "user@example.com" })

// Update user role
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

## Security Considerations

1. **Change default secrets**: Update JWT secrets in production
2. **Use strong passwords**: Enforce password complexity
3. **Enable SSL**: Use SSL/TLS for MongoDB connections
4. **Regular backups**: Implement database backup strategy
5. **Monitor access**: Log authentication attempts
6. **Rate limiting**: Implement rate limiting for API endpoints

## API Testing

### Test Registration
```bash
curl -X POST http://localhost:3003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:3003/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Backup and Recovery

### Create Backup
```bash
mongodump --db skillazon --out ./backup/
```

### Restore Backup
```bash
mongorestore --db skillazon ./backup/skillazon/
```

## Performance Optimization

1. **Indexes**: Ensure proper indexing for frequent queries
2. **Connection pooling**: Configure appropriate pool size
3. **Query optimization**: Use projection and filtering
4. **Monitoring**: Use MongoDB Compass or Atlas monitoring

## Support

For issues related to:
- MongoDB setup: Check MongoDB documentation
- Authentication: Review JWT configuration
- Database queries: Use MongoDB shell for testing
- Performance: Monitor database metrics

---

**Note**: This setup provides a robust foundation for user authentication. For production use, consider additional security measures and monitoring solutions.
