import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // For demo purposes, we'll simulate real-time functionality
  // In a real app, you would connect to a WebSocket server
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Simulate WebSocket connection
    const mockSocket = {
      emit: (event, data) => {
        console.log(`Mock emit: ${event}`, data);
        // Simulate server responses for demo
        if (event === 'join_room') {
          simulateUserJoin(data.username);
        } else if (event === 'send_message') {
          simulateMessageReceived(data);
        } else if (event === 'typing') {
          simulateTyping(data);
        }
      },
      on: (event, callback) => {
        console.log(`Mock listener registered for: ${event}`);
      },
      disconnect: () => {
        console.log('Mock socket disconnected');
      }
    };

    setSocket(mockSocket);

    return () => {
      if (mockSocket) {
        mockSocket.disconnect();
      }
    };
  }, []);

  const simulateUserJoin = (username) => {
    setOnlineUsers(prev => [...prev, username]);
    const systemMessage = {
      id: uuidv4(),
      username: 'System',
      message: `${username} joined the chat`,
      timestamp: new Date().toLocaleTimeString(),
      isSystem: true
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const simulateMessageReceived = (data) => {
    const newMessage = {
      id: uuidv4(),
      username: data.username,
      message: data.message,
      timestamp: new Date().toLocaleTimeString(),
      isSystem: false
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (data) => {
    if (data.isTyping) {
      setTypingUsers(prev => [...prev.filter(user => user !== data.username), data.username]);
    } else {
      setTypingUsers(prev => prev.filter(user => user !== data.username));
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
      if (socket) {
        socket.emit('join_room', { username: username.trim() });
      }
    }
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      const messageData = {
        username,
        message: inputMessage.trim(),
        timestamp: new Date().toISOString()
      };
      
      socket.emit('send_message', messageData);
      setInputMessage('');
      
      // Stop typing indicator
      setIsTyping(false);
      socket.emit('typing', { username, isTyping: false });
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    if (socket) {
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

  if (!isUsernameSet) {
    return (
      <div className="chat-container">
        <div className="username-form">
          <h2>Welcome to Skillazon Chat</h2>
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
    <div className="chat-container">
      <div className="chat-header">
        <h2>Skillazon Chat</h2>
        <div className="online-users">
          <span>Online: {onlineUsers.length}</span>
          <div className="users-list">
            {onlineUsers.map((user, index) => (
              <span key={index} className="user-badge">{user}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
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
        ))}
        
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={handleMessageSubmit}>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          maxLength={500}
          required
        />
        <button type="submit" disabled={!inputMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
