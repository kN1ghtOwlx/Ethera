# Full-stack team task management web application

Full-stack team task management web application where users can create projects, assign tasks, and track progress with role-based access control.

## Features

- User authentication
- JWT authorization
- Role-based access control
- Create and manage projects
- Create, assign, and update tasks
- Task status tracking
- Dashboard overview
- MongoDB integration
- Responsive UI

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Folder Structure

    Ethera/
    ├── frontend/
    └── backend/

## Installation

### Clone the project

    git clone <your-repo-url>
    cd Ethera

### Backend setup

    cd backend
    npm install

Create a `.env` file:

    PORT=8080
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    FRONTEND_URL=http://localhost:3000

Run backend:

    npm run dev

### Frontend setup

    cd frontend
    npm install

Create a `.env` file:

    VITE_API_URL=http://localhost:8080/api

Run frontend:

    npm run dev

## User Roles

### Admin
- Create projects
- Add members
- Create tasks
- Assign tasks
- Manage progress

### Member
- View assigned tasks
- Update task status

## API Routes

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Projects
- GET /api/projects
- POST /api/projects

### Tasks
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id

## Deployment

- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas

## Author

kN1ghtOwl