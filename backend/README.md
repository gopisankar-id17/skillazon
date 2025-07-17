# Skillazon Backend

This is the backend server for the Skillazon platform, built with Node.js and Express.

## Features

- JWT-based authentication
- User registration and login
- MongoDB integration with fallback to in-memory storage
- CORS configuration
- Password hashing with bcrypt

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (optional - will use in-memory storage as fallback)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/skillazon
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
PORT=3003
```

### Running the Server

```bash
node authServer.js
```

The server will start on port 3003 by default.

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/info` - Server information

## Database

The server supports MongoDB for persistent storage and falls back to in-memory storage if MongoDB is not available.
