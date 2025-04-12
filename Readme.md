# Expense Tracker App 💰

A full-stack expense tracking application that allows users to record expenses, set monthly budgets, and visualize spending patterns. Built with a React frontend and a Node.js + Express backend, using PostgreSQL for reliable data storage and analytics.

---

## 🚀 Features

- ### ✅ Core Functionality
- **Add, view, update, and delete expenses**
- **Categorize expenses** (Food, Transport, Shopping, etc.)
- **Set monthly budgets** and compare actual spending
- **Interactive visual reports** (category breakdowns, monthly trends)
- **User authentication** (JWT-based secure login/signup)


### 🛠 Additional Utilities
- **Expense summary dashboards**
- **Responsive React UI**

---

## 🧭 Tech Stack

- **Frontend:** React, Axios, Chart.js  
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL  
- **Auth:** JWT, bcrypt  
- **Email:** Nodemailer  

---

## 🛠 Getting Started

### Clone the repository
```bash
git clone https://github.com/pavni006/Expense-Tracker.git
cd Expense-Tracker
```

### Backend Setup 
```bash
cd backend
npm install
npm run start
```

### Create a .env file
```bash
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=expense_tracker
DB_PASS=your_db_password
DB_PORT=5432
JWT_SECRET=your_secret
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Backend runs on http://localhost:5000

Frontend runs on http://localhost:5173

---

## 📌 API Overview
- POST /users/signup – Register user
- POST /users/login – Login user
- POST /expenses – Add expense
- GET /expenses – List expenses
- POST /budgets – Set monthly budget
