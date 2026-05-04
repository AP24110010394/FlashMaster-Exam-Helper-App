# FlashMaster - Intelligent Study Companion Platform

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Frontend Guide](#frontend-guide)
- [Database Schema](#database-schema)
- [Development Workflow](#development-workflow)
- [Security & Authentication](#security--authentication)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**FlashMaster** is a comprehensive full-stack learning platform designed to help students and professionals optimize their study sessions through intelligent content organization, AI-powered flashcard generation, personalized study planning, and progress tracking. The platform leverages cutting-edge AI technology (Google Gemini) to transform raw study materials into structured learning aids.

### Purpose
FlashMaster addresses the challenge of information overload in modern education by providing:
- **Automated Content Processing**: Convert PDFs and documents into digestible flashcards
- **Intelligent Study Planning**: AI-assisted exam preparation with topic distribution
- **Progress Analytics**: Track learning progress and identify knowledge gaps
- **Multi-Modal Learning**: Flashcards, notes, study timers, and progress dashboards

### Target Users
- Students preparing for examinations
- Professionals seeking continuous learning
- Teachers developing educational content
- Learners using spaced repetition techniques

---

## Features

### Core Features

#### 1. **User Authentication & Authorization**
- Secure JWT-based authentication system
- User registration with email validation
- Role-based access control (User and Admin roles)
- Password encryption using bcryptjs (10-salt rounds)
- Session management with 1-hour token expiration
- User account deletion capability

#### 2. **Study Material Management**
- Support for multiple file formats (PDF, DOCX, TXT)
- Automatic text extraction from uploaded documents
- File storage in dedicated uploads directory
- Metadata tracking (filename, file size, upload timestamp)
- Material-to-flashcard association for organized learning
- User-specific material isolation for privacy

#### 3. **AI-Powered Flashcard Generation**
- Automated flashcard creation using Google Gemini 2.0 Flash API
- Intelligent question-answer pair generation from study materials
- Difficulty level classification (easy, medium, hard, unrated)
- Duplicate detection and removal
- JSON schema validation for consistent output format
- Fallback mock data for API rate limiting
- Support for up to 30,000 character text inputs

#### 4. **Intelligent Study Planning**
- AI-assisted study schedule generation
- Exam date-based planning with automatic topic distribution
- Subject-based organization
- Daily study hours allocation
- Topic completion tracking
- Intelligent date assignment for progressive learning
- Prevents past exam date selection

#### 5. **Flashcard Review System**
- Spaced repetition support with next review date tracking
- Difficulty rating and adjustment
- Review count tracking (timesReviewed)
- Easy filtering by difficulty level
- Material-linked flashcard retrieval

#### 6. **Progress Tracking & Analytics**
- Study session duration recording
- Topics completed counter
- Daily study hour tracking
- Progress visualization for users
- Admin capability to view all user progress
- Time-based analytics for learning patterns

#### 7. **Note-Taking System**
- User-specific note creation and management
- Content-rich note storage
- Note categorization and tagging
- Searchable note database
- Edit and delete functionality

#### 8. **Focus Timer**
- Pomodoro-style study timer
- Configurable study intervals
- Break time management
- Session history logging
- Time spent per subject tracking

#### 9. **Admin Dashboard**
- User management capabilities
- View all users and their data
- Force delete user accounts
- Study material visibility across users
- Progress analytics overview
- System monitoring and logging

### Advanced Features
- Real-time toast notifications
- Responsive UI design with Framer Motion animations
- Dark/Light theme support
- Material search and filtering
- Batch flashcard operations
- CORS-enabled API for cross-origin requests
- Error handling with descriptive messages

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.4.1
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Security**: bcryptjs 3.0.3
- **File Upload**: Multer 2.1.1
- **PDF Processing**: pdf-parse 2.4.5
- **AI Integration**: Google GenAI SDK 1.50.0
- **CORS**: cors 2.8.6
- **Environment**: dotenv 17.4.2

### Frontend
- **Framework**: React 19.2.4 with JSX
- **Build Tool**: Vite 8.0.4
- **Routing**: React Router DOM 7.14.1
- **HTTP Client**: Axios 1.15.0
- **Animation**: Framer Motion 12.38.0
- **Icons**: Lucide React 1.8.0
- **Styling**: CSS3 with custom theme support
- **Linting**: ESLint 9.39.4

### Infrastructure
- **API Server**: Running on port 5000 (configurable)
- **Database**: MongoDB (local or cloud)
- **Frontend Dev Server**: Vite dev server (default port 5173)
- **File Storage**: Local filesystem uploads directory

---

## Project Architecture

### Directory Structure

```
Full Stack Project/
├── backend/
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT token verification
│   │   └── adminMiddleware.js       # Admin role verification
│   ├── models/
│   │   ├── User.js                  # User schema (username, email, password, role)
│   │   ├── Flashcard.js             # Flashcard schema
│   │   ├── StudyPlan.js             # Study plan schema
│   │   ├── StudyMaterial.js         # Study material schema
│   │   ├── Note.js                  # Note schema
│   │   └── Progress.js              # Progress tracking schema
│   ├── routes/
│   │   ├── auth.js                  # Authentication endpoints
│   │   ├── flashcards.js            # Flashcard CRUD & generation
│   │   ├── studyplan.js             # Study plan endpoints
│   │   ├── materials.js             # File upload and retrieval
│   │   ├── notes.js                 # Note management
│   │   ├── progress.js              # Progress tracking
│   │   └── admin.js                 # Admin operations
│   ├── uploads/                     # Uploaded study materials
│   ├── server.js                    # Express server setup
│   ├── seed.js                      # Database seeding
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation component
│   │   │   └── Toast.jsx            # Notification system
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Login/Register page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── UploadPage.jsx       # Material upload
│   │   │   ├── FlashcardsPage.jsx   # Flashcard review
│   │   │   ├── StudyPlanPage.jsx    # Study plan management
│   │   │   ├── ProgressPage.jsx     # Progress tracking
│   │   │   ├── TimerPage.jsx        # Focus timer
│   │   │   └── NotesPage.jsx        # Note-taking
│   │   ├── assets/                 # Images and static files
│   │   ├── App.jsx                 # Root component
│   │   ├── App.css                 # Global styles
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Base CSS
│   ├── public/                     # Static public files
│   ├── vite.config.js              # Vite configuration
│   ├── eslint.config.js            # ESLint rules
│   └── package.json
│
├── credentials.md                  # Test credentials
└── package.json                    # Root configuration

```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                             │
│              React 19 + Vite Frontend                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Login Page → Dashboard → Upload → Flashcards        │   │
│  │            Study Plan  → Progress → Timer → Notes   │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │ Axios HTTP Requests
                             ↓
┌─────────────────────────────────────────────────────────────┐
│              Express.js API Server (Port 5000)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Routes: /api/auth, /api/flashcards, /api/materials   │  │
│  │         /api/studyplan, /api/progress, /api/notes    │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Middleware: Auth (JWT), Admin Role Verification      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
             │                              │
             │                              │
    ┌────────↓──────────┐        ┌────────↓──────────┐
    │   MongoDB Atlas   │        │ Google Gemini AI  │
    │   (Database)      │        │ (Content Gen)     │
    └───────────────────┘        └───────────────────┘
```

### Data Flow

1. **Authentication Flow**:
   - User submits credentials → Hashed password comparison → JWT token generation → Client storage

2. **Content Upload Flow**:
   - File upload → PDF/document parsing → Text extraction → MongoDB storage → Flashcard generation trigger

3. **AI Flashcard Generation**:
   - Study material retrieval → Text preprocessing → Gemini API call → JSON schema parsing → Database storage

4. **Study Plan Creation**:
   - User inputs exam date and topics → Date distribution algorithm → Topic assignment → Progress tracking

---

## Installation & Setup

### Prerequisites

Before starting, ensure you have:
- **Node.js** v18.x or higher (Download from [nodejs.org](https://nodejs.org))
- **npm** v9.x or higher (Comes with Node.js)
- **MongoDB** v5.0+ (Local or MongoDB Atlas cloud instance)
- **Google Gemini API Key** (Optional, for AI features)
- **Git** for version control (optional)

### Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd backend
```

#### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- Express.js for HTTP server
- Mongoose for MongoDB ODM
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- Google GenAI for AI features
- Other utilities

#### Step 3: Create Environment Configuration
Create a `.env` file in the `backend` directory:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/flashmaster
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/flashmaster

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Google Gemini AI (Optional)
GEMINI_API_KEY=your_gemini_api_key_here

# File Upload
MAX_FILE_SIZE=52428800  # 50MB in bytes
UPLOAD_DIR=./uploads
```

#### Step 4: Start the Backend Server
```bash
npm start
```

Expected output:
```
MongoDB connected
Server running on port 5000
```

### Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Create Environment Configuration
Create a `.env.local` file in the `frontend` directory:

```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=FlashMaster
```

#### Step 4: Start the Development Server
```bash
npm run dev
```

Expected output:
```
  VITE v8.0.4  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Full Application Startup

#### Using Terminal 1 - Backend:
```bash
cd backend
npm start
```

#### Using Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

---

## Configuration

### Environment Variables Reference

#### Backend (.env)

| Variable | Purpose | Default | Example |
|----------|---------|---------|---------|
| PORT | Server port | 5000 | 3000 |
| NODE_ENV | Environment | development | production |
| MONGO_URI | Database URL | local | mongodb+srv://... |
| JWT_SECRET | Token signing key | none | your_secret_key |
| GEMINI_API_KEY | AI API key | none | AIzaSy... |
| MAX_FILE_SIZE | Upload limit | 50MB | 104857600 |
| UPLOAD_DIR | File storage path | ./uploads | /var/uploads |

#### Frontend (.env.local)

| Variable | Purpose | Default |
|----------|---------|---------|
| VITE_API_URL | Backend API endpoint | http://localhost:5000 |
| VITE_APP_NAME | App display name | FlashMaster |

### Database Connection Options

#### Local MongoDB
```javascript
MONGO_URI=mongodb://127.0.0.1:27017/flashmaster
```

#### MongoDB Atlas (Cloud)
```javascript
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flashmaster
```

### Google Gemini API Setup

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Click "Create API Key"
3. Copy the generated API key
4. Paste into backend `.env` as `GEMINI_API_KEY`

**Note**: Without a valid API key, the system uses mock flashcard generation

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password_123"
}

# Response (Status 200)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password_123"
}

# Response (Status 200)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Current User
```http
GET /api/auth/current
Authorization: Bearer YOUR_JWT_TOKEN

# Response (Status 200)
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Delete User Account
```http
DELETE /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN

# Response (Status 200)
{
  "msg": "User deleted successfully"
}
```

### Materials Endpoints

#### Upload Study Material
```http
POST /api/materials/upload
Content-Type: multipart/form-data
Authorization: Bearer YOUR_JWT_TOKEN

# Form Data:
# file: <PDF/DOCX/TXT file>

# Response (Status 200)
{
  "_id": "607f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "filename": "biology_notes.pdf",
  "type": "pdf",
  "fileSize": 1024000,
  "extractedText": "Chapter 1: Cell Biology...",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Get All User Materials
```http
GET /api/materials/myMaterials
Authorization: Bearer YOUR_JWT_TOKEN

# Response (Status 200)
[
  {
    "_id": "607f1f77bcf86cd799439012",
    "filename": "biology_notes.pdf",
    "type": "pdf",
    "fileSize": 1024000,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Material by ID
```http
GET /api/materials/:id
Authorization: Bearer YOUR_JWT_TOKEN

# Response (Status 200)
{
  "_id": "607f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "filename": "biology_notes.pdf",
  "extractedText": "Chapter 1: Cell Biology...",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Delete Material
```http
DELETE /api/materials/:id
Authorization: Bearer YOUR_JWT_TOKEN

# Response (Status 200)
{
  "msg": "Material deleted successfully"
}
```

### Flashcard Endpoints

#### Generate Flashcards from Material
```http
POST /api/flashcards/generate
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "materialId": "607f1f77bcf86cd799439012"
}

# Response (Status 200)
[
  {
    "_id": "508f1f77bcf86cd799439013",
    "user": "507f1f77bcf86cd799439011",
    "material": "607f1f77bcf86cd799439012",
    "question": "What is photosynthesis?",
    "answer": "Process by which plants convert light into chemical energy",
    "difficulty": "unrated",
    "nextReviewDate": "2024-01-16T10:30:00Z",
    "timesReviewed": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get All Flashcards
```http
GET /api/flashcards
Authorization: Bearer YOUR_JWT_TOKEN

# Response (Status 200)
[
  {
    "_id": "508f1f77bcf86cd799439013",
    "question": "What is photosynthesis?",
    "answer": "Process by which plants convert...",
    "difficulty": "easy",
    "timesReviewed": 3
  }
]
```

#### Update Flashcard
```http
PUT /api/flashcards/:id
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "difficulty": "medium",
  "timesReviewed": 4
}

# Response (Status 200)
{
  "msg": "Flashcard updated",
  "_id": "508f1f77bcf86cd799439013",
  "difficulty": "medium"
}
```

#### Delete Flashcard
```http
DELETE /api/flashcards/:id
Authorization: Bearer YOUR_JWT_TOKEN

# Response (Status 200)
{
  "msg": "Flashcard deleted"
}
```

### Study Plan Endpoints

#### Create Study Plan
```http
POST /api/studyplan
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "examDate": "2024-06-15",
  "subjects": ["Biology", "Chemistry"],
  "topics": ["Cell Biology", "Photosynthesis", "Periodic Table"],
  "dailyStudyHours": 3
}

# Response (Status 200)
{
  "_id": "509f1f77bcf86cd799439014",
  "user": "507f1f77bcf86cd799439011",
  "examDate": "2024-06-15",
  "subjects": ["Biology", "Chemistry"],
  "topics": [
    {
      "name": "Cell Biology",
      "dateAssigned": "2024-01-15",
      "completed": false
    }
  ],
  "dailyStudyHours": 3,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Generate Study Plan from Material
```http
POST /api/studyplan/generate
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "materialId": "607f1f77bcf86cd799439012",
  "examDate": "2024-06-15",
  "dailyStudyHours": 3
}

# Response (Status 200)
{
  "_id": "509f1f77bcf86cd799439014",
  "user": "507f1f77bcf86cd799439011",
  "examDate": "2024-06-15",
  "topics": [
    {"name": "Topic 1", "dateAssigned": "2024-01-16", "completed": false}
  ]
}
```

#### Get All Study Plans
```http
GET /api/studyplan
Authorization: Bearer YOUR_JWT_TOKEN

# Response (Status 200)
[
  {
    "_id": "509f1f77bcf86cd799439014",
    "examDate": "2024-06-15",
    "dailyStudyHours": 3,
    "topics": []
  }
]
```

#### Update Study Plan
```http
PUT /api/studyplan/:id
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "topics": [
    {"name": "Cell Biology", "completed": true}
  ]
}

# Response (Status 200)
{
  "msg": "Study plan updated",
  "_id": "509f1f77bcf86cd799439014"
}
```

### Notes Endpoints

#### Create Note
```http
POST /api/notes
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "title": "Biology Chapter 1",
  "content": "Cells are the basic units of life..."
}

# Response (Status 200)
{
  "_id": "50af1f77bcf86cd799439015",
  "user": "507f1f77bcf86cd799439011",
  "title": "Biology Chapter 1",
  "content": "Cells are the basic units of life...",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer YOUR_JWT_TOKEN

# Response (Status 200)
[
  {
    "_id": "50af1f77bcf86cd799439015",
    "title": "Biology Chapter 1",
    "content": "Cells are..."
  }
]
```

### Progress Endpoints

#### Create Progress Entry
```http
POST /api/progress
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "topicName": "Photosynthesis",
  "studyDuration": 120,
  "topicsCompleted": 1
}

# Response (Status 200)
{
  "_id": "50bf1f77bcf86cd799439016",
  "user": "507f1f77bcf86cd799439011",
  "topicName": "Photosynthesis",
  "studyDuration": 120,
  "topicsCompleted": 1,
  "createdAt": "2024-01-15T12:30:00Z"
}
```

#### Get User Progress
```http
GET /api/progress
Authorization: Bearer YOUR_JWT_TOKEN

# Response (Status 200)
[
  {
    "_id": "50bf1f77bcf86cd799439016",
    "topicName": "Photosynthesis",
    "studyDuration": 120,
    "topicsCompleted": 1,
    "createdAt": "2024-01-15T12:30:00Z"
  }
]
```

### Admin Endpoints

#### Get All Users (Admin Only)
```http
GET /api/admin/users
Authorization: Bearer ADMIN_JWT_TOKEN

# Response (Status 200)
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Delete User (Admin Only)
```http
DELETE /api/admin/users/:id
Authorization: Bearer ADMIN_JWT_TOKEN

# Response (Status 200)
{
  "msg": "User deleted successfully"
}
```

---

## Frontend Guide

### Page-Based Architecture

#### 1. Login Page (`/login`)
- User registration form with email validation
- Login form with error handling
- Toast notifications for feedback
- JWT token storage in localStorage
- Redirect to dashboard on success

#### 2. Dashboard (`/`)
- Overview of user study statistics
- Quick links to main features
- Recent materials and flashcards
- Study progress summary
- Navigation to other pages

#### 3. Upload Page (`/upload`)
- Drag-and-drop file upload
- Multiple file format support (PDF, DOCX, TXT)
- Progress indicator during upload
- Confirmation of successful upload
- List of uploaded materials

#### 4. Flashcards Page (`/flashcards`)
- Flipcard animation for Q&A display
- Difficulty rating system
- Quick review navigation
- Filter by difficulty level
- Mark as complete/review

#### 5. Study Plan Page (`/studyplan`)
- Create new study plan form
- Exam date picker
- Subject and topic input
- AI topic generation from materials
- View existing study plans
- Topic completion tracking

#### 6. Progress Page (`/progress`)
- Study session logging
- Time tracking
- Topics completed statistics
- Daily study hour tracking
- Progress charts (if using charting library)

#### 7. Timer Page (`/timer`)
- Pomodoro/Focus timer
- Customizable study intervals
- Break timing
- Sound notifications
- Session statistics

#### 8. Notes Page (`/notes`)
- Rich text note editing
- Create new notes
- Note categorization
- Search functionality
- Note deletion

### Context API Structure

#### AuthContext
```javascript
{
  user: {
    id: string,
    username: string,
    email: string,
    role: string
  },
  token: string,
  login: (email, password) => Promise,
  register: (username, email, password) => Promise,
  logout: () => void,
  loading: boolean,
  error: string
}
```

### Component Reusability

#### Navbar Component
- Responsive navigation bar
- User authentication status display
- Logout functionality
- Page link navigation
- Mobile hamburger menu

#### Toast Component
- Success notifications
- Error messages
- Warning alerts
- Custom duration
- Auto-dismiss

### Styling System

The frontend uses a custom CSS theming system:
- Root color variables for consistency
- Responsive grid layout
- Flexbox components
- CSS transitions for smooth animations
- Mobile-first responsive design

---

## Database Schema

### User Schema
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Flashcard Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  material: ObjectId (ref: 'StudyMaterial'),
  question: String (required),
  answer: String (required),
  difficulty: String (enum: ['easy', 'medium', 'hard', 'unrated'], default: 'unrated'),
  nextReviewDate: Date (default: now),
  timesReviewed: Number (default: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### StudyMaterial Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  filename: String (required),
  type: String (required),
  extractedText: String (required),
  fileSize: Number (default: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### StudyPlan Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  examDate: Date (required),
  subjects: [String],
  topics: [{
    name: String,
    dateAssigned: Date,
    completed: Boolean (default: false)
  }],
  dailyStudyHours: Number (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Note Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  title: String (required),
  content: String (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Progress Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  topicName: String,
  studyDuration: Number (minutes),
  topicsCompleted: Number,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Development Workflow

### Common Development Tasks

#### Adding a New API Endpoint

1. **Create/Update Route Handler**
```javascript
// routes/newfeature.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const NewFeature = require('../models/NewFeature');

router.post('/', authMiddleware, async (req, res) => {
  try {
    // Implementation
    res.json({ msg: 'Success' });
  } catch (err) {
    res.status(500).json({ msg: 'Error' });
  }
});

module.exports = router;
```

2. **Register Route in server.js**
```javascript
app.use('/api/newfeature', require('./routes/newfeature'));
```

3. **Update Frontend API Call**
```javascript
// In React component
const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/newfeature`,
  data,
  { headers: { Authorization: `Bearer ${token}` } }
);
```

#### Adding a New Database Model

1. **Create Model File**
```javascript
// models/NewModel.js
const mongoose = require('mongoose');

const newModelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  field: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('NewModel', newModelSchema);
```

2. **Use in Route Handler**
```javascript
const NewModel = require('../models/NewModel');

const item = new NewModel({
  user: req.user.id,
  field: value
});
await item.save();
```

#### Testing API Endpoints

Use tools like:
- **Postman**: GUI-based API testing
- **Insomnia**: REST client alternative
- **cURL**: Command-line tool
- **Thunder Client**: VS Code extension

Example cURL request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Debugging

#### Backend Debugging

Enable detailed logging:
```javascript
// In server.js
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}
```

Use Node.js debugger:
```bash
node --inspect server.js
```

Then open `chrome://inspect` in Chrome

#### Frontend Debugging

- Use React Developer Tools extension
- Console debugging with `console.log()`
- Network tab in browser DevTools
- Local storage inspection

---

## Security & Authentication

### JWT Authentication Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ POST /api/auth/login
     │ {email, password}
     ↓
┌──────────────────────┐
│ Express Server       │
│ 1. Find User         │
│ 2. Verify Password   │
│ 3. Create JWT        │
└────┬────────────────┘
     │ Return JWT Token
     ↓
┌──────────┐
│  Client  │
│ Store    │
│ in Local │
│ Storage  │
└────┬─────┘
     │ ALL REQUESTS
     │ Header: Authorization: Bearer <token>
     ↓
┌──────────────────────┐
│ Express Server       │
│ Middleware:          │
│ 1. Extract Token     │
│ 2. Verify Token      │
│ 3. Get User ID       │
│ 4. Pass to Route     │
└────┬────────────────┘
     │ Process Request
     ↓
┌────────────────────┐
│ Database Operation │
└────────────────────┘
```

### Password Security

- **Hashing Algorithm**: bcryptjs with 10-salt rounds
- **Never store plain text passwords**
- **Compare during login**: `bcrypt.compare(inputPassword, hashedPassword)`
- **Enforce minimum requirements** in frontend validation

### Token Management

- **Token Expiration**: 3600 seconds (1 hour)
- **Storage**: localStorage (consider using httpOnly cookies for production)
- **Refresh Strategy**: Request login again after expiration
- **Production**: Use secure, httpOnly cookies with HTTPS

### Role-Based Access Control

```javascript
// Admin Middleware
module.exports = function (req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  next();
};
```

### CORS Configuration

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Input Validation**: Validate all user inputs on backend
3. **Rate Limiting**: Implement for auth endpoints
4. **SQL Injection**: Use Mongoose (prevents injection)
5. **XSS Prevention**: React auto-escapes content
6. **HTTPS**: Use in production (required for cookies)
7. **CORS**: Restrict to known domains
8. **Error Messages**: Don't leak sensitive info

---

## Troubleshooting

### Common Issues & Solutions

#### 1. MongoDB Connection Fails
**Error**: `DB Connection Error: connect ECONNREFUSED`

**Solutions**:
- Ensure MongoDB is running: `mongod` or MongoDB Compass
- Check MONGO_URI in .env is correct
- For Atlas: Verify IP whitelist includes your IP
- Test connection: `mongo mongodb://127.0.0.1:27017/flashmaster`

#### 2. API Port Already in Use
**Error**: `listen EADDRINUSE: address already in use :::5000`

**Solutions**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3000 npm start
```

#### 3. CORS Error in Browser
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
- Ensure frontend and backend have correct URLs in .env
- Check CORS is enabled in server.js
- For development: Use `http://localhost:5173`
- Clear browser cache and restart dev server

#### 4. JWT Token Invalid
**Error**: `Token is not valid`

**Solutions**:
- Clear localStorage and log in again
- Check JWT_SECRET matches between requests
- Verify token is sent in header: `Authorization: Bearer <token>`
- Check token hasn't expired (1 hour limit)

#### 5. File Upload Fails
**Error**: `413 Payload Too Large` or `ENOMEM`

**Solutions**:
- Increase limit in Express: `app.use(express.json({ limit: '100mb' }))`
- Check file size doesn't exceed 50MB
- For large files: Implement chunked upload
- Clear `uploads/` directory

#### 6. Gemini API Not Working
**Error**: `AI Generation Failed` or mock cards appearing

**Solutions**:
- Verify API key is valid and unexpired
- Check quota limits on Google Cloud
- Ensure text extraction worked (check logs)
- Test with simple text first
- Check network connectivity
- Use mock fallback for testing

#### 7. React Component Not Updating
**Issue**: State changes not reflected in UI

**Solutions**:
- Check dependencies array in useEffect
- Verify state setter is called
- Clear browser cache
- Check for console errors
- Ensure component is re-rendering

#### 8. Material Upload Extraction Empty
**Issue**: PDF uploaded but extractedText is empty

**Solutions**:
- Verify PDF is not scanned image (text-based PDF required)
- Check pdf-parse installation: `npm install pdf-parse`
- Check multer middleware is properly configured
- Increase file size limit if needed

### Logging & Debugging

#### Enable Detailed Logging
```javascript
// server.js
const morgan = require('morgan');
app.use(morgan('dev'));  // HTTP request logging

// Custom logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

#### Browser Console Debugging
```javascript
// Check auth context
console.log(useContext(AuthContext));

// Monitor API calls
const response = await axios.get(url);
console.log('Response:', response.data);

// Check localStorage
console.log(localStorage.getItem('token'));
```

#### Database Connection Test
```bash
# From backend directory
node -e "
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected!'))
  .catch(e => console.log('Error:', e));
"
```

---

## Contributing

### Development Guidelines

1. **Code Style**
   - Use consistent indentation (2 spaces)
   - Follow existing patterns in codebase
   - Comment complex logic
   - Use meaningful variable names

2. **Branch Naming**
   ```
   feature/feature-name
   bugfix/bug-name
   refactor/description
   docs/description
   ```

3. **Commit Messages**
   ```
   feat: Add flashcard generation feature
   fix: Correct JWT validation error
   docs: Update API documentation
   style: Format code consistency
   refactor: Simplify database query
   ```

4. **Testing Before Push**
   - Test all CRUD operations
   - Test authentication flows
   - Check error handling
   - Verify console for errors

### Pull Request Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes with atomic commits
4. Push to branch: `git push origin feature/your-feature`
5. Create Pull Request with description
6. Address review comments
7. Merge when approved

---

## License

This project is licensed under the ISC License. See LICENSE file for details.

---

## Additional Resources

### Documentation
- [Express.js Docs](https://expressjs.com)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Google Gemini API](https://ai.google.dev)
- [Mongoose ODM](https://mongoosejs.com)

### Useful Tools
- [Postman API Testing](https://www.postman.com)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [VS Code](https://code.visualstudio.com)
- [Git](https://git-scm.com)

### Support
For issues, questions, or suggestions:
- Create an Issue in the repository
- Check existing documentation
- Review error logs and console messages
- Contact the development team

---

**Last Updated**: May 4, 2026
**Version**: 1.0.0
**Status**: Active Development

---

## Quick Start Checklist

- [ ] Clone repository
- [ ] Install Node.js and npm
- [ ] Setup MongoDB locally or Atlas
- [ ] Backend: `npm install` and `npm start`
- [ ] Frontend: `npm install` and `npm run dev`
- [ ] Create `.env` files with required variables
- [ ] Get optional Google Gemini API key
- [ ] Access application at `http://localhost:5173`
- [ ] Test login with credentials from `credentials.md`
- [ ] Upload a PDF to test flashcard generation
- [ ] Review API endpoints with Postman

**Congratulations!** Your FlashMaster application is ready to use.
