# Skillazon Frontend

This is the frontend application for the Skillazon platform, built with React.

## Features

- Modern React application with hooks
- React Router for navigation
- Context API for state management
- Responsive design with CSS
- Authentication integration
- Skills marketplace functionality

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will start on port 3000 and automatically open in your browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── Skillazon logo.png
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Navigation/
│   │   ├── Home/
│   │   ├── Skills/
│   │   ├── Profile/
│   │   └── ...
│   ├── contexts/
│   ├── App.js
│   └── index.js
└── package.json
```

## Environment Variables

Create a `.env` file in the frontend directory if needed:

```env
REACT_APP_API_URL=http://localhost:3003
```

## Backend Integration

The frontend communicates with the backend API running on port 3003. Make sure the backend server is running before starting the frontend application.
