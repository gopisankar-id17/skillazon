import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSkills } from '../../contexts/SkillContext';
import { 
  UserIcon, 
  CameraIcon, 
  PencilIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  CheckBadgeIcon as BadgeCheckIcon,
  PhoneIcon,
  EnvelopeIcon as MailIcon,
  GlobeAltIcon as GlobeIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const { skills, getSkillsByTeacher, deleteSkill } = useSkills();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    linkedin: '',
    github: '',
    expertise: [],
    hourlyRate: '',
    experience: ''
  });
  const [newExpertise, setNewExpertise] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        expertise: user.expertise || [],
        hourlyRate: user.hourlyRate || '',
        experience: user.experience || ''
      });
      
      // Load user's skills
      if (user._id) {
        getSkillsByTeacher(user._id);
      }
    }
  }, [user, getSkillsByTeacher]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (expertise) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== expertise)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload avatar if changed
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }
      
      // Update profile
      await updateProfile(formData);
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(skillId);
      } catch (error) {
        console.error('Error deleting skill:', error);
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className="w-4 h-4 text-gray-300" />
            <StarIconSolid 
              className="w-4 h-4 text-yellow-400 absolute top-0 left-0"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>
        );
      } else {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const userSkills = skills.filter(skill => skill.teacher?._id === user?._id);

  const stats = {
    totalSkills: userSkills.length,
    totalStudents: userSkills.reduce((sum, skill) => sum + (skill.studentCount || 0), 0),
    averageRating: userSkills.length > 0 
      ? userSkills.reduce((sum, skill) => sum + (skill.averageRating || 0), 0) / userSkills.length 
      : 0,
    totalEarnings: userSkills.reduce((sum, skill) => sum + ((skill.completedSessions || 0) * skill.price), 0)
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-cover">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <UserIcon className="w-full h-full text-gray-400" />
                )}
                {isEditing && (
                  <label className="avatar-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <CameraIcon className="w-6 h-6" />
                  </label>
                )}
              </div>
              
              <div className="profile-info">
                <div className="profile-name-section">
                  <h1>{user.name}</h1>
                  {user.isTeacherVerified && (
                    <BadgeCheckIcon className="w-6 h-6 text-blue-500" title="Verified Teacher" />
                  )}
                </div>
                
                <div className="profile-meta">
                  {user.location && (
                    <span className="meta-item">
                      <MapPinIcon className="w-4 h-4" />
                      {user.location}
                    </span>
                  )}
                  <span className="meta-item">
                    <CalendarIcon className="w-4 h-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                
                {user.bio && (
                  <p className="profile-bio">{user.bio}</p>
                )}
                
                <div className="profile-actions">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn btn-primary"
                  >
                    <PencilIcon className="w-4 h-4" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.totalSkills}</div>
            <div className="stat-label">Skills Offered</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalStudents}</div>
            <div className="stat-label">Students Taught</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.averageRating.toFixed(1)}</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">${stats.totalEarnings}</div>
            <div className="stat-label">Total Earnings</div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="profile-content">
          <div className="content-tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              My Skills ({userSkills.length})
            </button>
            <button 
              className={`tab ${activeTab === 'edit' ? 'active' : ''}`}
              onClick={() => setActiveTab('edit')}
            >
              Edit Profile
            </button>
          </div>

          <div className="content-panels">
            {/* Overview Panel */}
            {activeTab === 'overview' && (
              <div className="content-panel">
                <div className="overview-grid">
                  <div className="overview-card">
                    <h3>Contact Information</h3>
                    <div className="contact-info">
                      <div className="contact-item">
                        <MailIcon className="w-5 h-5" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="contact-item">
                          <PhoneIcon className="w-5 h-5" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user.website && (
                        <div className="contact-item">
                          <GlobeIcon className="w-5 h-5" />
                          <a href={user.website} target="_blank" rel="noopener noreferrer">
                            {user.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="overview-card">
                    <h3>Expertise</h3>
                    {user.expertise && user.expertise.length > 0 ? (
                      <div className="expertise-tags">
                        {user.expertise.map((exp, index) => (
                          <span key={index} className="expertise-tag">
                            {exp}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="no-content">No expertise listed</p>
                    )}
                  </div>

                  <div className="overview-card">
                    <h3>Teaching Information</h3>
                    <div className="teaching-info">
                      {user.hourlyRate && (
                        <div className="info-item">
                          <span className="label">Hourly Rate:</span>
                          <span className="value">${user.hourlyRate}/hour</span>
                        </div>
                      )}
                      {user.experience && (
                        <div className="info-item">
                          <span className="label">Experience:</span>
                          <span className="value">{user.experience}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Panel */}
            {activeTab === 'skills' && (
              <div className="content-panel">
                <div className="skills-header">
                  <h3>My Skills</h3>
                  <button className="btn btn-primary">
                    <PlusIcon className="w-4 h-4" />
                    Add New Skill
                  </button>
                </div>

                {userSkills.length === 0 ? (
                  <div className="empty-state">
                    <h4>No skills created yet</h4>
                    <p>Start teaching by creating your first skill.</p>
                    <button className="btn btn-primary">
                      Create Your First Skill
                    </button>
                  </div>
                ) : (
                  <div className="skills-grid">
                    {userSkills.map(skill => (
                      <div key={skill._id} className="skill-card">
                        <div className="skill-header">
                          <h4>{skill.title}</h4>
                          <div className="skill-actions">
                            <button className="action-btn edit">
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button 
                              className="action-btn delete"
                              onClick={() => handleDeleteSkill(skill._id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="skill-description">{skill.description}</p>
                        
                        <div className="skill-meta">
                          <div className="skill-rating">
                            <div className="rating-stars">
                              {renderStars(skill.averageRating || 0)}
                            </div>
                            <span>{(skill.averageRating || 0).toFixed(1)}</span>
                          </div>
                          
                          <div className="skill-stats">
                            <span className="stat">
                              <ClockIcon className="w-4 h-4" />
                              {skill.duration} min
                            </span>
                            <span className="stat">
                              <UserIcon className="w-4 h-4" />
                              {skill.studentCount || 0} students
                            </span>
                          </div>
                        </div>
                        
                        <div className="skill-footer">
                          <span className="skill-price">
                            {skill.price === 0 ? 'Free' : `$${skill.price}`}
                          </span>
                          <span className="skill-category">
                            {skill.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Edit Panel */}
            {(activeTab === 'edit' || isEditing) && (
              <div className="content-panel">
                <form onSubmit={handleSubmit} className="edit-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="form-group">
                      <label>Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Hourly Rate ($)</label>
                      <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Experience</label>
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Describe your teaching or professional experience..."
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Expertise</label>
                      <div className="expertise-input">
                        <div className="input-group">
                          <input
                            type="text"
                            value={newExpertise}
                            onChange={(e) => setNewExpertise(e.target.value)}
                            placeholder="Add an expertise area..."
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                          />
                          <button type="button" onClick={addExpertise}>
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        {formData.expertise.length > 0 && (
                          <div className="expertise-tags">
                            {formData.expertise.map((exp, index) => (
                              <span key={index} className="expertise-tag">
                                {exp}
                                <button
                                  type="button"
                                  onClick={() => removeExpertise(exp)}
                                  className="remove-tag"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsEditing(false);
                        setActiveTab('overview');
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
