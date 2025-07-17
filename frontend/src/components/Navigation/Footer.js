import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon,
  EnvelopeIcon as MailIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <Link to="/" className="footer-brand">
              <BookOpenIcon className="brand-icon" />
              <span className="brand-text">Skillazon</span>
            </Link>
            <p className="brand-description">
              Connecting passionate learners with expert teachers in a peer-to-peer skill sharing platform.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.281C3.282 14.031 2.17 12.017 2.17 9.724c0-2.294 1.112-4.308 2.956-5.983.874-.79 2.026-1.281 3.323-1.281s2.448.49 3.323 1.281c1.844 1.675 2.956 3.689 2.956 5.983 0 2.293-1.112 4.307-2.956 5.982-.875.791-2.026 1.282-3.323 1.282zm7.568 0c-1.297 0-2.448-.49-3.323-1.281-1.844-1.675-2.956-3.689-2.956-5.982 0-2.294 1.112-4.308 2.956-5.983.875-.79 2.026-1.281 3.323-1.281s2.448.49 3.323 1.281c1.844 1.675 2.956 3.689 2.956 5.983 0 2.293-1.112 4.307-2.956 5.982-.875.791-2.026 1.282-3.323 1.282z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/skills" className="footer-link">Browse Skills</Link></li>
              <li><Link to="/create-skill" className="footer-link">Teach a Skill</Link></li>
              <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
              <li><Link to="/profile" className="footer-link">My Profile</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h3 className="footer-title">Popular Categories</h3>
            <ul className="footer-links">
              <li><Link to="/skills?category=Programming" className="footer-link">Programming</Link></li>
              <li><Link to="/skills?category=Design" className="footer-link">Design</Link></li>
              <li><Link to="/skills?category=Marketing" className="footer-link">Marketing</Link></li>
              <li><Link to="/skills?category=Music" className="footer-link">Music</Link></li>
              <li><Link to="/skills?category=Language" className="footer-link">Languages</Link></li>
              <li><Link to="/skills?category=Fitness" className="footer-link">Fitness</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              <li><Link to="/help" className="footer-link">Help Center</Link></li>
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li><Link to="/safety" className="footer-link">Safety Guidelines</Link></li>
              <li><Link to="/trust" className="footer-link">Trust & Safety</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Get in Touch</h3>
            <div className="contact-info">
              <div className="contact-item">
                <MailIcon className="contact-icon" />
                <span>support@skillazon.com</span>
              </div>
              <div className="contact-item">
                <PhoneIcon className="contact-icon" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <MapPinIcon className="contact-icon" />
                <span>San Francisco, CA</span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="newsletter">
              <h4 className="newsletter-title">Stay Updated</h4>
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-bottom-left">
              <p className="copyright">
                © {currentYear} Skillazon. All rights reserved.
              </p>
              <div className="footer-legal">
                <Link to="/privacy" className="legal-link">Privacy Policy</Link>
                <span className="separator">•</span>
                <Link to="/terms" className="legal-link">Terms of Service</Link>
                <span className="separator">•</span>
                <Link to="/cookies" className="legal-link">Cookie Policy</Link>
              </div>
            </div>
            
            <div className="footer-bottom-right">
              <p className="made-with-love">
                Made with <HeartIcon className="heart-icon" /> for the learning community
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
