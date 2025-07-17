const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store connected users and message history
let connectedUsers = new Map();
let messageHistory = [];

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user joining
  socket.on('join_room', (data) => {
    const { username } = data;
    connectedUsers.set(socket.id, username);
    socket.username = username;
    
    // Send message history to new user
    socket.emit('message_history', messageHistory);
    
    // Notify all users about new user
    socket.broadcast.emit('user_joined', {
      username,
      users: Array.from(connectedUsers.values())
    });
    
    // Send current users list to new user
    socket.emit('users_update', Array.from(connectedUsers.values()));
    
    console.log(`${username} joined the chat`);
  });

  // Handle messages
  socket.on('send_message', (data) => {
    const messageData = {
      id: data.id,
      username: data.username,
      message: data.message,
      timestamp: data.timestamp
    };
    
    // Store message in history
    messageHistory.push(messageData);
    
    // Limit message history to last 100 messages
    if (messageHistory.length > 100) {
      messageHistory = messageHistory.slice(-100);
    }
    
    // Broadcast message to all connected clients
    io.emit('message', messageData);
    
    console.log(`Message from ${data.username}: ${data.message}`);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const username = connectedUsers.get(socket.id);
    if (username) {
      connectedUsers.delete(socket.id);
      
      // Notify all users about user leaving
      socket.broadcast.emit('user_left', {
        username,
        users: Array.from(connectedUsers.values())
      });
      
      console.log(`${username} left the chat`);
    }
    console.log('Client disconnected:', socket.id);
  });
});

// Basic API endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    connectedUsers: connectedUsers.size,
    messageCount: messageHistory.length 
  });
});

app.get('/api/users', (req, res) => {
  res.json({ users: Array.from(connectedUsers.values()) });
});

app.get('/api/messages', (req, res) => {
  res.json({ messages: messageHistory });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`\n🚀 Skillazon Chat Server running on port ${PORT}`);
  console.log(`📱 Connect your React app to: http://localhost:${PORT}`);
  console.log(`🔗 API Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Active users: ${connectedUsers.size}`);
  console.log(`💬 Message history: ${messageHistory.length} messages\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
