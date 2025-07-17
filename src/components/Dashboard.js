import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = ({ onShowChat }) => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to Skillazon</h1>
        <p>Your learning and collaboration platform</p>
      </div>

      <div className="dashboard-content">
        <div className="user-info">
          <h2>Hello, {user.username}! 👋</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="dashboard-features">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Real-Time Chat</h3>
            <p>Connect with other learners and collaborate in real-time</p>
            <button className="feature-button" onClick={onShowChat}>
              Launch Chat
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Learning Resources</h3>
            <p>Access courses, tutorials, and educational materials</p>
            <button className="feature-button" disabled>
              Coming Soon
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Study Groups</h3>
            <p>Join or create study groups with fellow learners</p>
            <button className="feature-button" disabled>
              Coming Soon
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Monitor your learning progress and achievements</p>
            <button className="feature-button" disabled>
              Coming Soon
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Skill Assessment</h3>
            <p>Test your knowledge and get personalized recommendations</p>
            <button className="feature-button" disabled>
              Coming Soon
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Achievements</h3>
            <p>Earn badges and certificates for your accomplishments</p>
            <button className="feature-button" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
