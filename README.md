# MAAFAI Academy - Role-Based Management System

A fully functional academy management demo with React frontend and Node.js/Express backend.

## Features

- **Landing Page** – Public website with sections: Home, About, Batch Details, Awards, Our Students, Images & Videos
- **Student Login Request** – Students submit registration; access granted only after admin approval
- **Admin/Coach Dashboard** – Approve/reject students, manage students, create batches, assign students
- **Student Dashboard** – View name, email, batch, coach, attendance, fee status
- **Role-Based Access** – Student, Admin/Coach, and Public visitor roles

## User Roles

| Role | Access |
|------|--------|
| **Student** | Request access → Wait approval → Login → View dashboard |
| **Admin/Coach** | Login → Manage pending requests, students, batches |
| **Public** | View landing page, request student access |


## Flow

1. **Public** → Opens homepage
2. **Student** → Clicks "Student Login" → "Request Access" tab → Submits name, email, password
3. **Admin** → Logs in → Sees pending requests → Approves student
4. **Student** → Logs in (Login tab) → Sees dashboard
5. **Admin** → Manages students, creates batches, assigns students

## Tech Stack

- **Frontend:** React 18, Vite, React Router
- **Backend:** Node.js, Express
- **Storage:** JSON file (`backend/data/data.json`)

## Project Structure

```
MAAFAI/
├── frontend/
│   ├── src/
│   │   ├── api/           # API client (api.js)
│   │   ├── components/    # Navbar, RoleProtectedRoute
│   │   ├── context/       # AuthContext
│   │   ├── pages/         # LandingPage, StudentLogin, AdminLogin, etc.
│   │   └── App.jsx
│   └── vite.config.js
│
├── backend/
│   ├── controllers/       # studentController, adminController, authController
│   ├── routes/            # student, admin, auth
│   ├── data/              # store.js, data.json
│   └── server.js
│
└── README.md
```

## How to Run

### Backend
```bash
cd backend
npm install
npm start
```
Backend: **http://localhost:5000**

### Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend: **http://localhost:5173**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/student/register-request | Submit student registration (name, email, password) |
| POST | /api/student/login | Student login |
| POST | /api/admin/login | Admin login |
| GET | /api/admin/pending-requests | Get pending student requests |
| POST | /api/admin/approve-student | Approve student |
| POST | /api/admin/reject-student | Reject student |
| GET | /api/admin/students | Get all students |
| POST | /api/admin/delete-student | Delete student |
| GET | /api/admin/batches | Get batches |
| POST | /api/admin/create-batch | Create batch |
| POST | /api/admin/assign-student | Assign student to batch |

## Notes

- Data persists in `backend/data/data.json`
- Sessions are in-memory (reset on server restart)
- Old `/api/login` and `/api/user` remain for backward compatibility

