import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSkills } from '../../contexts/SkillContext';
import { useBookings } from '../../contexts/BookingContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { userSkills, fetchUserSkills } = useSkills();
  const { upcomingBookings, fetchUpcomingBookings, stats, fetchBookingStats } = useBookings();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserSkills(),
        fetchUpcomingBookings(),
        fetchBookingStats()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isTeacher = user?.role === 'teacher' || user?.role === 'both';
  const isStudent = user?.role === 'student' || user?.role === 'both';

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="overview-section">
      {/* Welcome Card */}
      <div className="welcome-card">
        <div className="welcome-content">
          <h2>Welcome back, {user.firstName || user.username}! 👋</h2>
          <p>Here's what's happening with your learning journey today.</p>
        </div>
        <div className="welcome-actions">
          {isTeacher && (
            <Link to="/create-skill" className="btn btn-primary">
              Create New Skill
            </Link>
          )}
          <Link to="/skills" className="btn btn-outline">
            Browse Skills
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {isStudent && (
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>{user.stats?.totalSessionsAsStudent || 0}</h3>
              <p>Sessions Completed</p>
            </div>
          </div>
        )}
        {isTeacher && (
          <>
            <div className="stat-card">
              <div className="stat-icon">🎓</div>
              <div className="stat-content">
                <h3>{user.stats?.totalSessionsAsTeacher || 0}</h3>
                <p>Sessions Taught</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>${user.stats?.totalEarnings || 0}</h3>
                <p>Total Earnings</p>
              </div>
            </div>
          </>
        )}
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{isTeacher ? (user.stats?.averageRatingAsTeacher || 0).toFixed(1) : (user.stats?.averageRatingAsStudent || 0).toFixed(1)}</h3>
            <p>Average Rating</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{upcomingBookings.length}</h3>
            <p>Upcoming Sessions</p>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Upcoming Sessions</h3>
          <Link to="/my-bookings" className="view-all-link">View all</Link>
        </div>
        {upcomingBookings.length > 0 ? (
          <div className="upcoming-sessions">
            {upcomingBookings.slice(0, 3).map((booking) => (
              <div key={booking._id} className="session-card">
                <div className="session-info">
                  <h4>{booking.skill.title}</h4>
                  <p className="session-participant">
                    {booking.teacher._id === user.id 
                      ? `Student: ${booking.student.firstName || booking.student.username}`
                      : `Teacher: ${booking.teacher.firstName || booking.teacher.username}`
                    }
                  </p>
                  <p className="session-time">
                    {new Date(booking.scheduledDate).toLocaleDateString()} at{' '}
                    {new Date(booking.scheduledDate).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div className="session-actions">
                  <Link to={`/booking/${booking._id}`} className="btn btn-sm btn-outline">
                    View Details
                  </Link>
                  {booking.meetingLink && (
                    <a 
                      href={booking.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No upcoming sessions</p>
            <Link to="/skills" className="btn btn-primary">
              Book a Session
            </Link>
          </div>
        )}
      </div>

      {/* My Skills (for teachers) */}
      {isTeacher && (
        <div className="dashboard-section">
          <div className="section-header">
            <h3>My Skills</h3>
            <Link to="/create-skill" className="view-all-link">Create new</Link>
          </div>
          {userSkills.length > 0 ? (
            <div className="skills-grid">
              {userSkills.slice(0, 3).map((skill) => (
                <div key={skill._id} className="skill-card-small">
                  <h4>{skill.title}</h4>
                  <p className="skill-category">{skill.category}</p>
                  <div className="skill-stats">
                    <span className="skill-rating">
                      ⭐ {skill.rating?.average?.toFixed(1) || '0.0'}
                    </span>
                    <span className="skill-sessions">
                      {skill.totalSessions} sessions
                    </span>
                  </div>
                  <Link to={`/skills/${skill._id}`} className="btn btn-sm btn-outline">
                    View Skill
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't created any skills yet</p>
              <Link to="/create-skill" className="btn btn-primary">
                Create Your First Skill
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <Link to="/skills" className="action-card">
            <div className="action-icon">🔍</div>
            <div className="action-content">
              <h4>Browse Skills</h4>
              <p>Discover new skills to learn</p>
            </div>
          </Link>
          <Link to="/chat" className="action-card">
            <div className="action-icon">💬</div>
            <div className="action-content">
              <h4>Messages</h4>
              <p>Chat with teachers and students</p>
            </div>
          </Link>
          <Link to="/profile" className="action-card">
            <div className="action-icon">👤</div>
            <div className="action-content">
              <h4>Update Profile</h4>
              <p>Manage your profile settings</p>
            </div>
          </Link>
          {isTeacher && (
            <Link to="/create-skill" className="action-card">
              <div className="action-icon">➕</div>
              <div className="action-content">
                <h4>Create Skill</h4>
                <p>Share your expertise</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p>Manage your learning and teaching activities</p>
        </div>
        <div className="header-actions">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          {isTeacher && (
            <button 
              className={`tab-btn ${activeTab === 'teaching' ? 'active' : ''}`}
              onClick={() => setActiveTab('teaching')}
            >
              Teaching
            </button>
          )}
          {isStudent && (
            <button 
              className={`tab-btn ${activeTab === 'learning' ? 'active' : ''}`}
              onClick={() => setActiveTab('learning')}
            >
              Learning
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {/* Add other tab content as needed */}
      </div>
    </div>
  );
};

export default Dashboard;
