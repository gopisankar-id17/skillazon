# Skillazon Chat Application

A real-time chat application built with React and Socket.io, featuring both demo and live chat functionality.

## Features

### Demo Chat
- ✅ Instant messaging interface
- ✅ User typing indicators
- ✅ Message history
- ✅ No server setup required
- ✅ Simulated real-time functionality

### Real-Time Chat
- ✅ WebSocket-based real-time messaging
- ✅ Multi-user support
- ✅ Live typing indicators
- ✅ Connection status monitoring
- ✅ Message persistence
- ✅ Online user tracking

## Installation & Setup

### Frontend (React App)
1. Ensure you're in the project root directory
2. Dependencies are already installed via the main package.json
3. Start the React app:
   ```bash
   npm start
   ```

### Backend (Chat Server)
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Start the chat server:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3002`

## Usage

### Getting Started
1. Start the React application (`npm start` in the root directory)
2. Open your browser and navigate to `http://localhost:3000`
3. Click "Launch Chat Application"
4. Choose between Demo Chat or Real-Time Chat

### Demo Chat
- Select "Demo Chat" to try the interface without setting up a server
- Enter a username and start chatting
- The demo simulates real-time functionality for testing purposes

### Real-Time Chat
- First, make sure the chat server is running (see Backend setup above)
- Select "Real-Time Chat"
- Enter a username and start chatting
- Open multiple browser windows/tabs to test multi-user functionality

## File Structure

```
src/
├── components/
│   ├── Chat.js              # Demo chat component
│   ├── Chat.css             # Demo chat styles
│   ├── RealTimeChat.js      # Real-time chat component
│   ├── RealTimeChat.css     # Real-time chat styles
│   ├── ChatApp.js           # Main chat application component
│   └── ChatApp.css          # Chat application styles
├── App.js                   # Main app component
└── App.css                  # Main app styles

server/
├── chatServer.js            # Express + Socket.io server
├── package.json             # Server dependencies
└── README.md               # This file
```

## Technical Details

### Frontend Technologies
- **React 19**: Modern React with hooks for state management
- **Socket.io Client**: WebSocket client for real-time communication
- **UUID**: Unique identifier generation for messages
- **CSS3**: Modern styling with gradients, animations, and responsive design

### Backend Technologies
- **Express.js**: Web application framework
- **Socket.io**: Real-time bidirectional event-based communication
- **CORS**: Cross-origin resource sharing configuration
- **Node.js**: JavaScript runtime environment

### Key Features Implementation

#### Message System
- Unique message IDs using UUID
- Timestamp tracking
- Message history persistence
- System messages for user join/leave events

#### User Management
- Username validation
- Online user tracking
- User join/leave notifications
- Connection status monitoring

#### Real-Time Features
- Typing indicators with auto-timeout
- Instant message delivery
- Connection state management
- Automatic reconnection handling

## API Endpoints

The chat server exposes the following REST endpoints:

- `GET /api/health` - Server health check and statistics
- `GET /api/users` - List of currently connected users
- `GET /api/messages` - Message history

## Socket.io Events

### Client → Server
- `join_room` - User joins the chat
- `send_message` - Send a message
- `typing` - Typing indicator

### Server → Client
- `message` - New message received
- `user_joined` - User joined notification
- `user_left` - User left notification
- `users_update` - Updated user list
- `typing` - Typing indicator from other users
- `message_history` - Historical messages

## Customization

### Styling
- Modify the CSS files in `src/components/` to customize the appearance
- The design uses CSS custom properties for easy theme changes
- Responsive design breakpoints are defined for mobile and tablet devices

### Server Configuration
- Change the server port in `server/chatServer.js`
- Update the `SOCKET_SERVER_URL` in `RealTimeChat.js` if using a different server URL
- Modify CORS settings in the server for production deployment

## Deployment

### Frontend
- Build the React app: `npm run build`
- Deploy the build folder to your hosting service

### Backend
- Deploy the server directory to your hosting service
- Update environment variables for production
- Ensure WebSocket connections are properly configured

## Troubleshooting

### Common Issues

1. **Server connection failed**
   - Ensure the chat server is running on port 3002
   - Check firewall settings
   - Verify CORS configuration

2. **Messages not appearing**
   - Check browser console for errors
   - Verify Socket.io connection status
   - Ensure server is running and accessible

3. **Typing indicators not working**
   - Check network connectivity
   - Verify Socket.io event listeners
   - Clear browser cache and reload

### Development Tips
- Use browser developer tools to monitor Socket.io events
- Check the server console for connection logs
- Use multiple browser windows to test multi-user functionality

## License

This project is part of the Skillazon application and is available under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please create an issue in the project repository or contact the development team.
