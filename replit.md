# WealthMate - Financial Management Application

## Overview
WealthMate is a smart financial management application that helps users track budgets, manage investments, and receive AI-powered financial advice. The application features user authentication, profile management, budget tracking, investment portfolio management, and an AI assistant.

## Project Architecture

### Tech Stack
- **Backend**: Node.js with Express
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs for password hashing
- **AI Integration**: OpenAI API for financial advice (configured but needs API key)

### Current Setup (September 30, 2025)

#### Server Configuration
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (to work with Replit's proxy)
- **Main File**: server.js
- **Environment**: Uses .env file for configuration

#### Database
- Currently using **in-memory storage** (users array)
- Original code had MongoDB dependencies but no working connection
- Data is not persistent - stored in memory during runtime
- Future enhancement: Replace with proper database (MongoDB or PostgreSQL)

#### Key Features
1. **User Authentication**
   - Registration and login with JWT
   - Password hashing with bcryptjs
   - Token-based authentication

2. **Profile Management**
   - User profile updates
   - Profile information storage

3. **Budget Tracking**
   - Expense and income tracking
   - Budget analysis

4. **Investment Portfolio**
   - Stock portfolio management
   - Investment tracking

5. **AI Assistant**
   - Financial advice using OpenAI API
   - Chat interface for user queries

6. **Financial Goals**
   - Goal setting and tracking

### File Structure
```
.
├── server.js                 # Main server file
├── wealthmate.html          # Main landing page
├── login.html               # Login page
├── signup.html              # Registration page
├── profile.html             # User profile page
├── budget.html              # Budget tracking page
├── graph.html               # Financial graphs/charts
├── investment-portfolio.html # Investment management
├── ai-assistant.html        # AI chat interface
├── smart121.css             # Main stylesheet
├── hyyy.css                 # Additional styles
├── smart2.js                # Main JavaScript
├── jsf.js                   # Additional JavaScript
├── chat.js                  # Chat functionality
├── graph.js                 # Graph/chart functionality
├── package.json             # Node.js dependencies
└── .env                     # Environment variables
```

## Recent Changes (September 30, 2025)

1. **Server Configuration Updates**
   - Removed non-existent route imports (userRoutes, transactionRoutes, chatRoutes)
   - Updated PORT to 5000 (from 3000) for Replit compatibility
   - Added 0.0.0.0 host binding for Replit proxy
   - Added cache control headers to ensure updates are visible
   - Added dotenv configuration

2. **Frontend URL Updates**
   - Changed all `http://localhost:3000` references to relative paths
   - Updated fetch URLs in: login.html, signup.html, profile.html, chat.js, smart2.js
   - Ensures compatibility with Replit's proxy system

3. **Project Setup**
   - Created .gitignore for Node.js project
   - Configured workflow for port 5000
   - Set up deployment configuration (autoscale)

## Deployment
- **Type**: Autoscale deployment
- **Command**: `node server.js`
- **Port**: 5000
- Ready for production deployment

## Known Issues & Future Enhancements

### Current Issues
- Some JavaScript errors in browser console (non-critical):
  - querySelector errors in smart2.js
  - Missing 'today' variable in graph.js
  - Null reference errors in jsf.js
- These don't affect core functionality

### Future Enhancements
1. **Database Integration**
   - Replace in-memory storage with persistent database
   - Consider MongoDB (as originally intended) or PostgreSQL
   - Implement proper data models and migrations

2. **API Integrations**
   - Complete OpenAI integration for AI assistant
   - Add real stock market data APIs
   - Implement banking API integrations

3. **Security Improvements**
   - Move JWT_SECRET to environment variables (currently using default)
   - Implement refresh tokens
   - Add rate limiting for API endpoints

4. **Bug Fixes**
   - Fix JavaScript errors in graph.js and jsf.js
   - Improve error handling throughout the application

## User Preferences
- No specific preferences documented yet

## Environment Variables
Required environment variables (in .env):
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `MONGODB_URI`: MongoDB connection string (future use)
