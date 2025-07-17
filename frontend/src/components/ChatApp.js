import React, { useState } from 'react';
import Chat from './Chat';
import RealTimeChat from './RealTimeChat';
import './ChatApp.css';

const ChatApp = () => {
  const [selectedMode, setSelectedMode] = useState(null);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleBackToSelection = () => {
    setSelectedMode(null);
  };

  if (selectedMode === 'demo') {
    return (
      <div className="chat-app">
        <div className="back-button-container">
          <button className="back-button" onClick={handleBackToSelection}>
            ← Back to Selection
          </button>
        </div>
        <Chat />
      </div>
    );
  }

  if (selectedMode === 'realtime') {
    return (
      <div className="chat-app">
        <div className="back-button-container">
          <button className="back-button" onClick={handleBackToSelection}>
            ← Back to Selection
          </button>
        </div>
        <RealTimeChat />
      </div>
    );
  }

  return (
    <div className="chat-app">
      <div className="mode-selection">
        <div className="selection-header">
          <h1>Skillazon Chat</h1>
          <p>Choose your chat experience</p>
        </div>
        
        <div className="mode-options">
          <div className="mode-card" onClick={() => handleModeSelect('demo')}>
            <div className="mode-icon">💬</div>
            <h3>Demo Chat</h3>
            <p>Experience the chat interface with simulated functionality. Perfect for testing the UI and user experience.</p>
            <ul className="features-list">
              <li>✅ Instant messaging interface</li>
              <li>✅ User typing indicators</li>
              <li>✅ Message history</li>
              <li>✅ No server setup required</li>
            </ul>
            <button className="select-button">Try Demo</button>
          </div>

          <div className="mode-card" onClick={() => handleModeSelect('realtime')}>
            <div className="mode-icon">🚀</div>
            <h3>Real-Time Chat</h3>
            <p>Full real-time chat with WebSocket connection. Connect with multiple users simultaneously.</p>
            <ul className="features-list">
              <li>✅ Real-time messaging</li>
              <li>✅ Multi-user support</li>
              <li>✅ Live typing indicators</li>
              <li>✅ Connection status</li>
            </ul>
            <button className="select-button primary">Start Real-Time</button>
          </div>
        </div>

        <div className="setup-instructions">
          <h3>🔧 Setup Instructions for Real-Time Chat</h3>
          <div className="instructions-content">
            <p><strong>To use Real-Time Chat, you need to run the chat server:</strong></p>
            <ol>
              <li>Open a new terminal/command prompt</li>
              <li>Navigate to the server directory: <code>cd server</code></li>
              <li>Install dependencies: <code>npm install</code></li>
              <li>Start the server: <code>npm start</code></li>
              <li>Server will run on <code>http://localhost:3001</code></li>
            </ol>
            <p>Once the server is running, you can use the Real-Time Chat mode!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
