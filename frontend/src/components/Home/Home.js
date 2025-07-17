import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSkills } from '../../contexts/SkillContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const { getTopRatedSkills } = useSkills();
  const [topSkills, setTopSkills] = useState([]);
  const [stats, setStats] = useState({
    totalTeachers: 1250,
    totalStudents: 3400,
    totalSessions: 8900,
    avgRating: 4.8
  });

  useEffect(() => {
    loadTopSkills();
  }, []);

  const loadTopSkills = async () => {
    try {
      const skills = await getTopRatedSkills(6);
      setTopSkills(skills);
    } catch (error) {
      console.error('Error loading top skills:', error);
    }
  };

  const features = [
    {
      icon: '🎓',
      title: 'Learn from Experts',
      description: 'Connect with skilled professionals and learn from the best in their field.'
    },
    {
      icon: '💡',
      title: 'Share Your Knowledge',
      description: 'Teach others and earn money by sharing your expertise and skills.'
    },
    {
      icon: '🤝',
      title: 'Peer-to-Peer Learning',
      description: 'Build meaningful connections while learning and teaching skills together.'
    },
    {
      icon: '⭐',
      title: 'Quality Assured',
      description: 'All teachers are verified and rated by students to ensure quality learning.'
    }
  ];

  const categories = [
    { name: 'Programming', icon: '💻', count: 245 },
    { name: 'Design', icon: '🎨', count: 189 },
    { name: 'Languages', icon: '🗣️', count: 156 },
    { name: 'Music', icon: '🎵', count: 134 },
    { name: 'Fitness', icon: '💪', count: 98 },
    { name: 'Business', icon: '📊', count: 87 }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Learn. Teach. Grow Together.</h1>
            <p>
              Join Skillazon's peer-to-peer learning platform where students and professionals 
              share knowledge, build skills, and create meaningful connections.
            </p>
            <div className="hero-actions">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">
                    Start Learning
                  </Link>
                  <Link to="/skills" className="btn btn-secondary">
                    Browse Skills
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <div className="skill-bubble">JavaScript</div>
              <div className="skill-bubble">Design</div>
              <div className="skill-bubble">Spanish</div>
              <div className="skill-bubble">Guitar</div>
              <div className="skill-bubble">Marketing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.totalTeachers.toLocaleString()}+</div>
              <div className="stat-label">Expert Teachers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.totalStudents.toLocaleString()}+</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.totalSessions.toLocaleString()}+</div>
              <div className="stat-label">Sessions Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.avgRating}/5</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Skillazon?</h2>
            <p>Experience the power of peer-to-peer learning</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>Popular Categories</h2>
            <p>Explore skills across various domains</p>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={`/skills?category=${category.name}`} 
                className="category-card"
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <span>{category.count} skills</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Skills Section */}
      <section className="top-skills">
        <div className="container">
          <div className="section-header">
            <h2>Top Rated Skills</h2>
            <p>Learn from the best teachers on our platform</p>
          </div>
          <div className="skills-grid">
            {topSkills.map((skill) => (
              <Link key={skill._id} to={`/skills/${skill._id}`} className="skill-card">
                <div className="skill-header">
                  <h3>{skill.title}</h3>
                  <div className="skill-rating">
                    <span className="rating-stars">⭐</span>
                    <span>{skill.rating?.average?.toFixed(1) || '5.0'}</span>
                  </div>
                </div>
                <p className="skill-description">{skill.description}</p>
                <div className="skill-footer">
                  <div className="skill-teacher">
                    <img 
                      src={skill.teacher?.profile?.avatar || '/default-avatar.png'} 
                      alt={skill.teacher?.fullName}
                      className="teacher-avatar"
                    />
                    <span>{skill.teacher?.fullName || skill.teacher?.username}</span>
                  </div>
                  <div className="skill-price">
                    {skill.price > 0 ? `$${skill.price}` : 'Free'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/skills" className="btn btn-outline">
              View All Skills
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join thousands of learners and teachers on Skillazon today</p>
            {!user && (
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started for Free
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
