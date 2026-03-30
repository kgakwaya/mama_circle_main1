# 🤰 Mama Circle

A student project built to support African mothers through postpartum depression using anonymous, low-bandwidth-first digital support.

**Live site:** [https://mama-circle-main1.vercel.app/dashboard](https://mama-circle-main1.vercel.app/dashboard)

---

## 🚀 Setup Instructions

### Prerequisites

* Node.js 18+
* npm 9+
* Git
* PostgreSQL database

---

### 1. Install project dependencies

```bash
npm install
cd server
npm install
cd ..
```

---

### 2. Backend environment setup

Create a file called `server/.env`:

```
DATABASE_URL=postgresql://user:password@host:5432/mama_circle
JWT_SECRET=your_secret_key_32_chars_minimum
PORT=5000
NODE_ENV=development
```

---

### 3. Frontend environment setup

Create a `.env` file in the root folder:

```
VITE_API_URL=http://localhost:5000/api
```

---

### 4. Initialize database

```bash
cd server
npm run db:init
cd ..
```

---

### 5. Run backend server

```bash
cd server
npm run dev
```

---

### 6. Run frontend app

```bash
npm run dev
```

---

### 7. Open the application

[http://localhost:5173](http://localhost:5173)

---

## 👤 Test Account

**Admin User**

* Username: admin
* Password: Admin123!

---

## 🗂 Project Structure

```
MAMA-CIRCLE/
├── src/
├── server/
├── public/
├── package.json
```

---

## 🔧 Key Features

* Anonymous user system (nickname-based)
* Discussion forums
* Peer support groups
* Mood tracking system
* Real-time chat (WebSocket)
* Admin moderation tools

---

## 🛠 Tech Stack

### Frontend

* React 19 + TypeScript
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios
* React Router
* WebSocket

### Backend

* Node.js + Express
* PostgreSQL
* JWT Authentication
* bcrypt password hashing
* WebSocket server

---

## 🔌 API Endpoints

* POST /api/auth/register
* POST /api/auth/login
* GET /api/posts
* POST /api/posts
* GET /api/groups
* POST /api/chat/messages
* GET /api/admin/stats

---

## 🌐 Deployment

* Platform: Vercel
* Live URL: [https://mama-circle-main1.vercel.app/dashboard](https://mama-circle-main1.vercel.app/dashboard)

---

## 🔒 Security

* JWT authentication
* Password hashing using bcrypt
* Anonymous user identities
* Secure API communication (HTTPS)

---

## 👩‍💻 Project Info

**Student:** Gakwaya Ineza Ketia

**Project:** Mama Circle
