# 🎬 CinemaHub Lite

A modern, full-stack movie ticket booking web application with a **strong focus on UI/UX**, built using **React, Tailwind CSS, Node.js, Express, and MongoDB**.

CinemaHub Lite provides a smooth and interactive booking experience with features like **seat selection, reward system, admin dashboard, and payment integration** — while keeping the backend simple and reliable.

---

## 🚀 Live Features

### 🎬 Movie Browsing

* View all available movies
* Clean and modern movie cards
* Movie details page with description and duration

---

### 🪑 Seat Selection System

* Interactive cinema-style seat layout
* Select multiple seats
* Booked seats are disabled
* Real-time price calculation

---

### 📅 Show Booking

* Select show date and time
* Book tickets easily
* Smooth booking flow

---

### 🎁 Loyalty Reward System

* Earn points on every booking
* Redeem points for discounts
* View reward history in profile

---

### 👤 User System

* Register and login
* Secure password hashing using bcrypt
* Profile page with:

  * Reward points
  * Booking history

---

### 💳 Payment System

* Integrated payment flow (Razorpay / simulated)
* Booking confirmation after payment

---

### ⏳ Cancellation & Refund

* Cancel booking within **10 minutes**
* Seats are freed after cancellation
* Refund supported (or simulated)

---

### 👑 Admin Panel

* Add movies
* Edit movies
* Delete movies
* Role-based access control

---

## 🧠 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios

### Backend (Simple & Minimal)

* Node.js
* Express.js
* MongoDB (Mongoose)

---

## 📁 Project Structure

```
cinemahub-lite/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   └── src/
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```
git clone <your-repo-link>
cd cinemahub-lite
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/cinemahub
JWT_SECRET=your_secret
RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret
```

---

### 3️⃣ Seed Database

```
npm run seed
```

Demo users created:

```
User: demo@cinemahub.com / demo123
Admin: admin@cinemahub.com / admin123
```

---

### 4️⃣ Start Backend

```
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

### 5️⃣ Frontend Setup

Open a new terminal:

```
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173 or 5174
```

---

## 🔗 API Endpoints

### Movies

* GET `/api/movies`
* POST `/api/movies`
* PUT `/api/movies/:id`
* DELETE `/api/movies/:id`

### Users

* POST `/api/users/register`
* GET `/api/users/:id/profile`

### Bookings

* POST `/api/bookings`

### Shows

* GET `/api/shows`

### Rewards

* GET `/api/users/:id/rewards`

---

## 🎨 UI/UX Highlights

* Modern, clean interface using Tailwind CSS
* Smooth hover and transition effects
* Responsive design (mobile + desktop)
* Interactive seat selection experience
* Clear and engaging profile dashboard

---

## 🔐 Security

* Password hashing using bcrypt
* Input validation
* Role-based access for admin routes

---

## 🧪 Testing

* APIs tested using Postman
* Booking flow verified
* Seat availability validated
* Reward system tested

---

## 🚀 Future Improvements

* Real-time seat locking (WebSockets)
* Advanced payment verification
* Notifications system
* Deployment (Docker + Cloud)

---

## 💡 Key Design Philosophy

> Focus on **user experience first**, while keeping the backend simple and maintainable.

---

## 👨‍💻 Author

Pratik Vats
Shitanshu Shekhar
Chandramani Kumar
Rishav Kumar Jha
Gautam Kumar

CSE Student | Full-Stack Developer

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share your feedback!



XXX-------login details -------------XXX

Role	            Email	           Password

Demo User	    demo@cinemahub.com	    demo123
Admin	        admin@cinemahub.com	    admin123

XXX---------------------------------XXX


Terminal 1 — Backend:
cd backend
npm install
npm run dev       # starts the backend on port 5000


Terminal 2 — Frontend:
cd frontend
npm install
npm run dev       # starts the frontend on port 5173

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX