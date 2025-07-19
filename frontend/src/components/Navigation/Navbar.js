import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBookings } from '../../contexts/BookingContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getUpcomingBookingsCount, getPendingBookingsCount } = useBookings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const upcomingBookings = getUpcomingBookingsCount();
  const pendingBookings = getPendingBookingsCount();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/Skillazon logo.png" alt="Skillazon" className="logo-image" />
          <span className="logo-text">Skillazon</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu desktop-menu">
          <div className="menu-items">
            <Link 
              to="/" 
              className={`menu-item ${isActive('/') ? 'active' : ''}`}
              onClick={() => console.log('🔗 Navbar: Home clicked')}
            >
              Home
            </Link>
            <Link 
              to="/skills" 
              className={`menu-item ${isActive('/skills') ? 'active' : ''}`}
              onClick={() => console.log('🔗 Navbar: Skills clicked')}
            >
              Skills
            </Link>
            <Link 
              to="/professionals" 
              className={`menu-item ${isActive('/professionals') ? 'active' : ''}`}
              onClick={() => console.log('🔗 Navbar: Professionals clicked')}
            >
              Professionals
            </Link>
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}
                  onClick={() => console.log('🔗 Navbar: Dashboard clicked')}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/my-bookings" 
                  className={`menu-item ${isActive('/my-bookings') ? 'active' : ''}`}
                  onClick={() => console.log('🔗 Navbar: My Bookings clicked')}
                >
                  My Bookings
                  {(upcomingBookings > 0 || pendingBookings > 0) && (
                    <span className="notification-badge">
                      {upcomingBookings + pendingBookings}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/chat" 
                  className={`menu-item ${isActive('/chat') ? 'active' : ''}`}
                  onClick={() => console.log('🔗 Navbar: Messages clicked')}
                >
                  Messages
                </Link>
              </>
            )}

            {/* Auth Section - Moved to be part of menu items */}
            {user ? (
              <div className="user-menu">
                <button 
                  className="user-menu-btn"
                  onClick={toggleProfileDropdown}
                >
                  <img 
                    src={user.profile?.avatar || '/default-avatar.png'} 
                    alt={user.username}
                    className="user-avatar"
                  />
                  <span className="user-name">{user.firstName || user.username}</span>
                  <svg 
                    className={`dropdown-arrow ${isProfileDropdownOpen ? 'open' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileDropdownOpen && (
                  <div className="user-dropdown">
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <span className="dropdown-icon">👤</span>
                      My Profile
                    </Link>
                    {(user.role === 'teacher' || user.role === 'both') && (
                      <Link 
                        to="/create-skill" 
                        className="dropdown-item"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <span className="dropdown-icon">➕</span>
                        Create Skill
                      </Link>
                    )}
                    <Link 
                      to="/reviews" 
                      className="dropdown-item"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <span className="dropdown-icon">⭐</span>
                      Reviews
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="dropdown-item"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <span className="dropdown-icon">⚙️</span>
                        Admin Panel
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item logout-btn"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <span className="dropdown-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link 
                  to="/login" 
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Navigation */}
        <div className={`navbar-menu mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-nav">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/skills" 
              className={`nav-link ${isActive('/skills') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Skills
            </Link>
            <Link 
              to="/professionals" 
              className={`nav-link ${isActive('/professionals') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Professionals
            </Link>
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/my-bookings" 
                  className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Bookings
                  {(upcomingBookings > 0 || pendingBookings > 0) && (
                    <span className="notification-badge">
                      {upcomingBookings + pendingBookings}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/chat" 
                  className={`nav-link ${isActive('/chat') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  className="nav-link logout-btn"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <>
                <Link 
                  to="/login" 
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Dropdown overlay */}
      {isProfileDropdownOpen && (
        <div 
          className="dropdown-overlay"
          onClick={() => setIsProfileDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
