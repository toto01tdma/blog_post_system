# Blog Post System

A full-stack blog application built with Koa.js and React.

## Features

- User authentication (signup/login) with JWT
- Create, read, and delete blog posts
- Protected routes and API endpoints
- Responsive and modern UI

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

Install all dependencies (both backend and frontend) with a single command:
```bash
npm run install-all
```

## Running the Application

You have two options to run the application:

### Option 1: Run both servers with a single command (recommended)

```bash
npm start
```
or
```bash
npm run dev
```

This will start both the backend server (on http://localhost:3001) and the frontend development server (on http://localhost:3000) concurrently. The application will automatically open in your default browser.

### Option 2: Run servers separately

1. Start the backend server (from the root directory):
   ```bash
   npm run start:backend
   ```
   The server will run on http://localhost:3001

2. Start the frontend development server (from the root directory):
   ```bash
   npm run start:frontend
   ```
   The application will open in your browser at http://localhost:3000

## Troubleshooting

### Windows Users

If you encounter permission errors or issues running the development servers, try the following:

1. Close your current terminal/command prompt
2. Right-click on Command Prompt or PowerShell and select "Run as administrator"
3. Navigate to your project directory
4. Run these commands in sequence:
   ```bash
   npm run install-all
   npm start
   ```

If you still encounter issues, try running the servers separately (Option 2 above) in two different administrator terminal windows.

### Common Issues

1. **Port already in use**: Make sure ports 3000 and 3001 are not being used by other applications
2. **Module not found errors**: Try removing the node_modules folders and running `npm run install-all` again
3. **Permission errors**: Run the terminal as administrator (Windows) or use sudo (Linux/Mac)

## API Endpoints

- POST /signup - Register a new user
- POST /login - Authenticate user and get JWT token
- GET /posts - Get all blog posts (requires authentication)
- POST /posts - Create a new blog post (requires authentication)
- DELETE /posts/:id - Delete a blog post (requires authentication)

## Technologies Used

- Backend:
  - Koa.js
  - JSON Web Tokens (JWT)
  - bcryptjs for password hashing
  - In-memory data storage

- Frontend:
  - React
  - TypeScript
  - React Router
  - Axios
  - Context API for state management