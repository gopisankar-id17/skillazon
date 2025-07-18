# Skillazon - Learn & Teach Skills Platform

Skillazon is a comprehensive platform that connects learners with skilled professionals, enabling knowledge sharing and skill development across various domains.

## 🗂️ Project Structure

```
skillazon/
├── backend/                 # Node.js/Express server
│   ├── config/             # Database and configuration files
│   │   └── database.js     # MongoDB connection setup
│   ├── models/             # MongoDB/Mongoose models
│   │   └── User.js         # User model schema
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route handlers
│   ├── authServer.js       # Main authentication server
│   ├── package.json        # Backend dependencies
│   ├── .env               # Environment variables (create this)
│   └── README.md           # Backend documentation
├── frontend/               # React application
│   ├── src/                # React source code
│   │   ├── components/     # React components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Navigation/ # Navbar and routing
│   │   │   ├── Home/       # Landing page
│   │   │   ├── Skills/     # Skills marketplace
│   │   │   ├── Profile/    # User profiles
│   │   │   ├── Booking/    # Booking system
│   │   │   ├── Dashboard/  # User dashboard
│   │   │   ├── Reviews/    # Reviews and ratings
│   │   │   ├── Chat/       # Messaging system
│   │   │   └── Admin/      # Admin panel
│   │   ├── contexts/       # React Context providers
│   │   │   ├── AuthContext.js
│   │   │   ├── SkillContext.js
│   │   │   └── BookingContext.js
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Application entry point
│   ├── public/             # Static assets
│   │   ├── index.html      # HTML template
│   │   ├── manifest.json   # PWA manifest
│   │   └── Skillazon logo.png # Application logo
│   ├── package.json        # Frontend dependencies
│   └── README.md           # Frontend documentation
├── package.json            # Root package.json for scripts
├── start-backend.bat       # Windows batch file to start backend
├── start-frontend.bat      # Windows batch file to start frontend
└── README.md              # This file
```

## 🚀 Quick Start

### Method 1: Using Batch Files (Windows)
1. **Start Backend**: Double-click `start-backend.bat`
2. **Start Frontend**: Double-click `start-frontend.bat`

### Method 2: Using npm Scripts (Recommended)
```bash
# Install dependencies for both frontend and backend
npm run install:all

# Start both frontend and backend simultaneously
npm start

# Or start them separately
npm run start:backend    # Starts backend on port 3003
npm run start:frontend   # Starts frontend on port 3000
```

### Method 3: Manual Setup
```bash
# Backend
cd backend
npm install
node authServer.js

# Frontend (in a new terminal)
cd frontend
npm install
npm start
```

## 📦 Available Scripts

From the root directory:

- `npm start` - Start both frontend and backend concurrently
- `npm run install:all` - Install dependencies for both projects
- `npm run install:backend` - Install backend dependencies only
- `npm run install:frontend` - Install frontend dependencies only
- `npm run start:backend` - Start backend server only
- `npm run start:frontend` - Start frontend development server only
- `npm run build` - Build frontend for production
- `npm test` - Run frontend tests

## 🌟 Features

### Frontend (React)
- **Modern React Architecture**: Hooks, Context API, functional components
- **Responsive Design**: Full-width navbar with glass morphism effect
- **Authentication System**: Register, login, logout with JWT tokens
- **Skills Marketplace**: Browse, search, and book skills
- **User Profiles**: Comprehensive user and teacher profiles
- **Booking Management**: Schedule and manage learning sessions
- **Real-time Chat**: Communication between users
- **Admin Dashboard**: Administrative controls and analytics
- **PWA Support**: Progressive Web App with custom favicon

### Backend (Node.js/Express)
- **RESTful API**: Clean API design with proper error handling
- **JWT Authentication**: Secure token-based authentication
- **Database Integration**: MongoDB with Mongoose ODM
- **Fallback Storage**: In-memory storage when MongoDB unavailable
- **CORS Configuration**: Cross-origin request handling
- **Password Security**: bcrypt hashing for user passwords
- **Environment Configuration**: Flexible environment variable setup

## 🛠️ Technology Stack

### Frontend Technologies
- **React 18+**: Modern frontend framework
- **React Router**: Client-side routing
- **Context API**: Global state management
- **CSS3**: Modern styling with flexbox and grid
- **Heroicons**: Icon library
- **JavaScript ES6+**: Modern JavaScript features

### Backend Technologies
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: Object Data Modeling (ODM) library
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management

## ⚙️ Environment Setup

### Backend Environment Variables
Create `backend/.env` file:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/skillazon

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=3003
CORS_ORIGIN=http://localhost:3000

# Optional: Additional configuration
NODE_ENV=development
```

### Frontend Environment Variables
Create `frontend/.env` file (optional):
```env
# API Configuration
REACT_APP_API_URL=http://localhost:3003
REACT_APP_API_TIMEOUT=10000

# Optional: Feature flags
REACT_APP_ENABLE_ANALYTICS=false
```

## 🗄️ Database Setup

### MongoDB (Recommended)
1. **Install MongoDB** locally or use MongoDB Atlas
2. **Update connection string** in `backend/.env`
3. **Start MongoDB** service
4. The application will automatically create collections

### In-Memory Fallback
If MongoDB is unavailable, the backend automatically switches to in-memory storage:
- Data persists only during server session
- Perfect for development and testing
- No additional setup required

## 🔌 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/info` - Server information

### Skills Endpoints
- `GET /api/skills` - List all skills
- `POST /api/skills` - Create new skill (authenticated)
- `GET /api/skills/:id` - Get skill details
- `PUT /api/skills/:id` - Update skill (authenticated)
- `DELETE /api/skills/:id` - Delete skill (authenticated)

### Bookings Endpoints
- `GET /api/bookings` - List user bookings (authenticated)
- `POST /api/bookings` - Create new booking (authenticated)
- `GET /api/bookings/:id` - Get booking details (authenticated)
- `PUT /api/bookings/:id` - Update booking status (authenticated)

## 🔧 Development Guidelines

### Code Style
- Use **ESLint** and **Prettier** for consistent formatting
- Follow **React best practices** for component design
- Implement **proper error handling** throughout the application
- Use **meaningful variable and function names**

### Component Architecture
- Keep components **small and focused**
- Use **React hooks** for state management
- Implement **proper prop validation**
- Handle **loading and error states**

### State Management
- Use **Context API** for global application state
- Keep **local state** for component-specific data
- Implement **proper cleanup** in useEffect hooks

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test                    # Run all tests
npm test -- --coverage    # Run with coverage report
npm test -- --watch       # Run in watch mode
```

### Backend Testing
```bash
cd backend
npm test                   # Run backend tests (when implemented)
```

## 🚀 Production Deployment

### Frontend Build
```bash
cd frontend
npm run build              # Creates optimized production build
```

### Backend Deployment
```bash
cd backend
npm install --production   # Install production dependencies only
NODE_ENV=production node authServer.js
```

### Environment Variables for Production
Ensure all environment variables are properly set:
- Database connection strings
- JWT secrets (use strong, unique keys)
- CORS origins (restrict to your domain)
- Port configuration

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Workflow
1. Make sure both backend and frontend servers are running
2. Test your changes thoroughly
3. Ensure code follows project conventions
4. Update documentation if necessary

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Issues**: Open an issue in the GitHub repository
- **Documentation**: Check individual README files in `frontend/` and `backend/` directories
- **Development**: Ensure both servers are running on correct ports (3000 for frontend, 3003 for backend)

## 🙏 Acknowledgments

- React team for the amazing frontend framework
- Express.js community for the robust backend framework
- MongoDB team for the flexible database solution
- All contributors who help improve this project

---

**Happy Learning and Teaching with Skillazon! 🎓✨**
