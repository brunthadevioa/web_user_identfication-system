# Web User Identification System 🛡️

A modern, full-stack web application designed for secure user identification, credential verification, and comprehensive administrative management. Built with a React frontend and a Node.js/Express backend.

## 🌟 Features

- **Secure Authentication:** User registration and login system.
- **Admin Dashboard:** Comprehensive control panel for system administrators.
- **Credential Verification:** Review and verify user-submitted identification documents.
- **Audit Logs:** Track system activities and user interactions securely.
- **Real-time Notifications:** Keep users and admins informed with system alerts.
- **Modern UI:** Built with React and Vite for a lightning-fast, responsive user experience.

## 💻 Tech Stack

**Frontend:**
- React 19
- Vite (Build Tool)
- React Router DOM (Navigation)
- Axios (API Requests)
- Lucide React (Icons)
- CSS3 (Vanilla styling)

**Backend:**
- Node.js
- Express.js
- MySQL (Database)
- JSON Web Tokens (JWT Authentication)
- Bcrypt (Password Hashing)
- Multer (File Uploads)

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 1. Database Setup
1. Open your MySQL client.
2. Create a database named `user_verification_db`.
3. The application includes initialization scripts (`backend/setupDb.js` and `backend/setupExtensionsDb.js`) to automatically build the necessary tables when the backend runs.

### 2. Backend Setup
Navigate into the backend directory:
```bash
cd backend
```
Install dependencies:
```bash
npm install
```
Start the backend server:
```bash
node server.js
```
*The backend will run on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the Vite development server:
```bash
npm run dev
```
*The frontend will be available at `http://localhost:5173`*

## 📁 Project Structure

```
user_identification_system/
│
├── backend/                # Node.js Express server
│   ├── controllers/        # Route logic and database interactions
│   ├── .env                # Environment variables
│   ├── db.js               # Database connection setup
│   └── server.js           # Main server entry point
│
└── frontend/               # React Vite application
    ├── src/
    │   ├── components/     # Reusable UI components (Navbar, Sidebar)
    │   ├── pages/          # Full page views (Dashboard, Admin Panel)
    │   └── App.jsx         # Main React component and router
    └── package.json        # Frontend dependencies
```

## 📝 License
This project is open-source and available under the ISC License.
