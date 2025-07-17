import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SkillProvider } from './contexts/SkillContext';
import { BookingProvider } from './contexts/BookingContext';

// Components
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Navigation/Footer';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import Skills from './components/Skills/Skills';
import SkillDetail from './components/Skills/SkillDetail';
import CreateSkill from './components/Skills/CreateSkill';
import Bookings from './components/Booking/Bookings';
import BookingDetail from './components/Booking/BookingDetail';
import Reviews from './components/Reviews/Reviews';
import Chat from './components/Chat/Chat';
import AdminDashboard from './components/Admin/AdminDashboard';
import TeacherProfile from './components/Profile/TeacherProfile';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <SkillProvider>
        <BookingProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/skills" element={<Skills />} />
                  <Route path="/skills/:id" element={<SkillDetail />} />
                  <Route path="/teacher/:id" element={<TeacherProfile />} />

                  {/* Private Routes */}
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/profile" element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } />
                  <Route path="/create-skill" element={
                    <PrivateRoute>
                      <CreateSkill />
                    </PrivateRoute>
                  } />
                  <Route path="/my-bookings" element={
                    <PrivateRoute>
                      <Bookings />
                    </PrivateRoute>
                  } />
                  <Route path="/booking/:id" element={
                    <PrivateRoute>
                      <BookingDetail />
                    </PrivateRoute>
                  } />
                  <Route path="/reviews" element={
                    <PrivateRoute>
                      <Reviews />
                    </PrivateRoute>
                  } />
                  <Route path="/chat" element={
                    <PrivateRoute>
                      <Chat />
                    </PrivateRoute>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </BookingProvider>
      </SkillProvider>
    </AuthProvider>
  );
}

export default App;
