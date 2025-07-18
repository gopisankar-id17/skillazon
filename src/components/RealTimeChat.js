import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import './RealTimeChat.css';

const RealTimeChat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // For development/demo purposes - you can change this to your actual server URL
  const SOCKET_SERVER_URL = 'http://localhost:3002';

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_SERVER_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling']
    });

    // Connection event listeners
    newSocket.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('Connected');
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setConnectionStatus('Disconnected');
      console.log('Disconnected from server');
    });

    newSocket.on('connect_error', (error) => {
      setIsConnected(false);
      setConnectionStatus('Connection Error');
      console.error('Connection error:', error);
    });

    // Chat event listeners
    newSocket.on('message', (data) => {
      const newMessage = {
        id: data.id || uuidv4(),
        username: data.username,
        message: data.message,
        timestamp: new Date(data.timestamp).toLocaleTimeString(),
        isSystem: data.isSystem || false
      };
      setMessages(prev => [...prev, newMessage]);
    });

    newSocket.on('user_joined', (data) => {
      setOnlineUsers(data.users);
      const systemMessage = {
        id: uuidv4(),
        username: 'System',
        message: `${data.username} joined the chat`,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    newSocket.on('user_left', (data) => {
      setOnlineUsers(data.users);
      const systemMessage = {
        id: uuidv4(),
        username: 'System',
        message: `${data.username} left the chat`,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    newSocket.on('users_update', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('typing', (data) => {
      if (data.username !== username) {
        if (data.isTyping) {
          setTypingUsers(prev => [...prev.filter(user => user !== data.username), data.username]);
        } else {
          setTypingUsers(prev => prev.filter(user => user !== data.username));
        }
      }
    });

    newSocket.on('message_history', (history) => {
      setMessages(history.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp).toLocaleTimeString()
      })));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && socket) {
      setIsUsernameSet(true);
      socket.connect();
      socket.emit('join_room', { username: username.trim() });
    }
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket && isConnected) {
      const messageData = {
        id: uuidv4(),
        username,
        message: inputMessage.trim(),
        timestamp: new Date().toISOString()
      };
      
      socket.emit('send_message', messageData);
      setInputMessage('');
      
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        socket.emit('typing', { username, isTyping: false });
      }
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    if (socket && isConnected) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit('typing', { username, isTyping: true });
      }
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing', { username, isTyping: false });
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessageSubmit(e);
    }
  };

  const handleReconnect = () => {
    if (socket) {
      socket.connect();
    }
  };

  if (!isUsernameSet) {
    return (
      <div className="realtime-chat-container">
        <div className="username-form">
          <h2>Skillazon Real-Time Chat</h2>
          <p>Connect with others in real-time!</p>
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              required
            />
            <button type="submit">Join Chat</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="realtime-chat-container">
      <div className="chat-header">
        <div className="header-left">
          <h2>Skillazon Real-Time Chat</h2>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-indicator"></span>
            {connectionStatus}
            {!isConnected && (
              <button className="reconnect-btn" onClick={handleReconnect}>
                Reconnect
              </button>
            )}
          </div>
        </div>
        <div className="online-users">
          <span>Online: {onlineUsers.length}</span>
          <div className="users-list">
            {onlineUsers.map((user, index) => (
              <span key={index} className={`user-badge ${user === username ? 'own-user' : ''}`}>
                {user}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.isSystem ? 'system-message' : ''} ${
                msg.username === username ? 'own-message' : ''
              }`}
            >
              {!msg.isSystem && (
                <div className="message-header">
                  <span className="username">{msg.username}</span>
                  <span className="timestamp">{msg.timestamp}</span>
                </div>
              )}
              <div className="message-content">{msg.message}</div>
            </div>
          ))
        )}
        
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={handleMessageSubmit}>
        <input
          type="text"
          placeholder={isConnected ? "Type your message..." : "Connecting..."}
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          maxLength={500}
          disabled={!isConnected}
          required
        />
        <button type="submit" disabled={!inputMessage.trim() || !isConnected}>
          Send
        </button>
      </form>
    </div>
  );
};

export default RealTimeChat;
