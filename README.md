# Getting Started with Create React App

# 🎓 Skillazon: Peer-to-Peer Skill Sharing Platform

## Overview
Skillazon is a comprehensive peer-to-peer skill sharing platform where students and professionals can teach and learn skills from each other. The platform supports video calls, booking systems, reviews, and real-time chat functionality.

## 🚀 Features

### ✅ Authentication System
- **User Registration/Login** with email validation
- **Role-based Access Control**: Student, Teacher, Both, Admin
- **JWT Authentication** with access and refresh tokens
- **Password Security** with bcrypt hashing
- **Account Management** with profile settings

### ✅ Profile Management
- **Comprehensive User Profiles** with bio, experience, education
- **Teacher Profiles** with specializations and availability
- **Avatar Upload** and social links
- **Skill Verification** system for teachers
- **Rating and Review** system

### ✅ Skill Listing System
- **Create/Edit Skills** with detailed descriptions
- **Skill Categories**: Programming, Design, Languages, Music, etc.
- **Skill Levels**: Beginner, Intermediate, Advanced, Expert
- **Pricing System** (Free or Paid sessions)
- **Search and Filter** functionality
- **Skill Reviews** and ratings

### ✅ Booking System
- **Session Booking** with calendar integration
- **Booking Management**: Pending, Confirmed, Cancelled, Completed
- **Meeting Integration**: Zoom, Google Meet, Jitsi, In-person
- **Booking Notifications** and reminders
- **Cancellation Policy** (24-hour minimum)
- **Session Completion** tracking

### ✅ Real-time Chat System
- **Direct Messaging** between users
- **Real-time Communication** with Socket.io
- **Message History** persistence
- **Typing Indicators** and online status
- **Group Chat** support

### ✅ Review and Rating System
- **Bidirectional Reviews**: Students rate teachers and vice versa
- **5-Star Rating System** with written reviews
- **Review Moderation** and reporting
- **Teacher Response** to reviews
- **Verified Reviews** from completed sessions

### ✅ Admin Dashboard
- **User Management**: View, edit, suspend users
- **Content Moderation**: Manage skills, reviews, reports
- **Platform Analytics**: User stats, session metrics
- **Payment Management**: Track earnings and transactions
- **System Monitoring**: Platform health and performance

### ✅ Advanced Features
- **Payment Integration** ready (Stripe/PayPal compatible)
- **Video Call Integration** with WebRTC/Jitsi
- **Mobile Responsive** design
- **Email Notifications** system
- **Multi-language Support** ready
- **API Documentation** included

## 🛠️ Technology Stack

### Frontend
- **React 19** with Hooks and Context API
- **React Router 6** for navigation
- **CSS3** with modern styling and animations
- **Socket.io Client** for real-time features
- **Heroicons & Lucide React** for icons
- **Date-fns** for date manipulation

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Database Models
- **User Model**: Complete user profiles with roles
- **Skill Model**: Skill listings with categories and pricing
- **Booking Model**: Session management with status tracking
- **Review Model**: Rating and review system
- **Message Model**: Chat message persistence

## 📁 Project Structure

```
skillazon/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── PrivateRoute.js
│   │   │   └── AdminRoute.js
│   │   ├── Dashboard/
│   │   │   └── Dashboard.js
│   │   ├── Profile/
│   │   │   ├── Profile.js
│   │   │   └── TeacherProfile.js
│   │   ├── Skills/
│   │   │   ├── Skills.js
│   │   │   ├── SkillDetail.js
│   │   │   └── CreateSkill.js
│   │   ├── Booking/
│   │   │   ├── Bookings.js
│   │   │   └── BookingDetail.js
│   │   ├── Reviews/
│   │   │   └── Reviews.js
│   │   ├── Chat/
│   │   │   └── Chat.js
│   │   ├── Admin/
│   │   │   └── AdminDashboard.js
│   │   ├── Navigation/
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   └── Home/
│   │       └── Home.js
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   ├── SkillContext.js
│   │   └── BookingContext.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── server/
│   ├── models/
│   │   ├── SkillazonUser.js
│   │   ├── Skill.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── skills.js
│   │   ├── bookings.js
│   │   └── reviews.js
│   ├── middleware/
│   │   └── authenticateToken.js
│   ├── config/
│   │   └── database.js
│   ├── authServer.js
│   ├── chatServer.js
│   ├── setupDatabase.js
│   ├── .env
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skillazon.git
   cd skillazon
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/.env.example server/.env
   ```
   
   Update the `.env` file with your MongoDB connection string and other settings:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/skillazon
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key
   
   # Server Configuration
   PORT=3003
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   cd server
   node setupDatabase.js
   cd ..
   ```

5. **Start the development servers**
   
   Terminal 1 - Frontend (React):
   ```bash
   npm start
   ```
   
   Terminal 2 - Authentication Server:
   ```bash
   cd server
   node authServer.js
   ```
   
   Terminal 3 - Chat Server:
   ```bash
   cd server
   node chatServer.js
   ```

### Access the Application
- **Frontend**: http://localhost:3000
- **Auth API**: http://localhost:3003
- **Chat Server**: http://localhost:3002

### Default Admin User
- **Email**: admin@skillazon.com
- **Password**: admin123
- **Role**: Admin

⚠️ **Important**: Change the admin password after first login!

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - User login
POST /api/auth/refresh     - Refresh access token
POST /api/auth/logout      - User logout
GET  /api/auth/profile     - Get user profile
PUT  /api/auth/profile     - Update user profile
```

### Skills Endpoints
```
GET    /api/skills              - Get all skills with filters
GET    /api/skills/:id          - Get skill by ID
POST   /api/skills              - Create new skill (teacher)
PUT    /api/skills/:id          - Update skill (teacher/admin)
DELETE /api/skills/:id          - Delete skill (teacher/admin)
GET    /api/skills/teacher/:id  - Get skills by teacher
GET    /api/skills/featured/top-rated - Get top-rated skills
```

### Booking Endpoints
```
GET    /api/bookings/my-bookings     - Get user's bookings
GET    /api/bookings/upcoming       - Get upcoming bookings
GET    /api/bookings/:id            - Get booking details
POST   /api/bookings               - Create new booking
PATCH  /api/bookings/:id/confirm    - Confirm booking (teacher)
PATCH  /api/bookings/:id/cancel     - Cancel booking
PATCH  /api/bookings/:id/complete   - Complete booking (teacher)
GET    /api/bookings/stats/user     - Get booking statistics
```

## 🎨 UI/UX Features

### Modern Design
- **Clean, Professional Interface** with intuitive navigation
- **Responsive Design** that works on all devices
- **Dark/Light Mode** support (configurable)
- **Smooth Animations** and transitions
- **Accessible Design** following WCAG guidelines

### User Experience
- **Smart Search** with filters and categories
- **Real-time Updates** for bookings and messages
- **Notification System** for important events
- **Progress Tracking** for learning journey
- **Social Features** for community building

## 🔐 Security Features

### Data Protection
- **Password Hashing** with bcrypt and salt
- **JWT Token Security** with expiration and refresh
- **Input Validation** and sanitization
- **SQL Injection Protection** with Mongoose
- **XSS Protection** with Content Security Policy

### Privacy Controls
- **Profile Visibility** settings
- **Contact Information** protection
- **Review Moderation** system
- **Report and Block** functionality
- **GDPR Compliance** ready

## 📱 Mobile Responsiveness

The platform is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🚀 Deployment

### Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set up production environment**
   ```bash
   # Update server/.env for production
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   ```

3. **Deploy to your hosting platform**
   - Frontend: Netlify, Vercel, or AWS S3
   - Backend: Heroku, AWS EC2, or DigitalOcean
   - Database: MongoDB Atlas or self-hosted

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=3003
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillazon
JWT_SECRET=your-very-secure-production-jwt-secret
JWT_REFRESH_SECRET=your-very-secure-refresh-secret
CORS_ORIGIN=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@skillazon.com or join our community Discord.

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core platform functionality
- ✅ User authentication and profiles
- ✅ Skill listing and booking system
- ✅ Real-time chat

### Phase 2 (Next)
- 🔄 Payment integration (Stripe/PayPal)
- 🔄 Video call integration (WebRTC)
- 🔄 Mobile app (React Native)
- 🔄 Advanced analytics

### Phase 3 (Future)
- 📱 AI-powered skill recommendations
- 🌍 Multi-language support
- 🎓 Certification system
- 🏆 Gamification features

---

**Built with ❤️ by the Skillazon Team**

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
