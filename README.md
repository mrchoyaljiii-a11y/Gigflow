# Gig Platform Project

This project is a **full‑stack gig / freelancing platform** consisting of two separate folders:

* **gig_frontend** – React + Tailwind CSS frontend
* **gig_backend** – Node.js + Express + MongoDB backend

---

##  Project Structure

```
project-root/
│
├── gig_frontend/
└── gig_backend/
```

---

##  1. gig_frontend (Frontend)

The frontend is built using **React**, **Redux**, **React Router**, and **Tailwind CSS**.

###  Required NPM Packages

```
{
  "axios": "^1.13.2",
  "react-hook-form": "^7.71.0",
  "react-icons": "^5.5.0",
  "react-redux": "^9.2.0",
  "react-router-dom": "^7.12.0",
  "tailwindcss": "^4.1.18"
}
```

### How to Run Frontend

```
cd gig_frontend
npm install
npm run dev
```

The frontend will start in development mode.

---

##  2. gig_backend (Backend)

The backend is built using **Node.js**, **Express**, and **MongoDB** with JWT authentication.

###  Required NPM Packages

```
{
  "bcrypt": "^6.0.0",
  "bcryptjs": "^3.0.3",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.1.3"
}
```

###  Scripts Setup

Add the following script inside **package.json**:

```
"scripts": {
  "dev": "nodemon server.js"
}
```

###  How to Run Backend

```
cd gig_backend
npm install
npm run dev
```

The server will start using **nodemon**.

---

##  Environment Variables

Create a `.env` file inside `gig_backend` and add required variables such as:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gigfreelancer
JWT_SECRET=supersecretkey
```

---

##  Tech Stack

* **Frontend:** React, Redux, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT

---

##  Notes

* Make sure MongoDB is running before starting the backend
* Run frontend and backend in separate terminals

