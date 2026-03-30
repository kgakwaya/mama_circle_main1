# 🤰 Mama Circle

A digital support platform for African mothers navigating postpartum depression. Anonymous-first, mobile-first, Vercel + Node/Postgres.

Live demo: https://mama-circle-main1.vercel.app/dashboard

---

## 🚀 Setup (exact steps)

### Prerequisites
- Node.js 18+ (`node --version`)
- npm 9+ (`npm --version`)
- Git (`git --version`)
- PostgreSQL 12+ or Neon database

### 1) Clone and install
```bash
git clone https://github.com/your-username/MAMA-CIRCLE.git
cd MAMA-CIRCLE
npm install
cd server
npm install
cd ..
```

### 2) Backend env
Create `server/.env`:
```env
DATABASE_URL=postgresql://user:password@host:5432/mama_circle
JWT_SECRET=your_super_secret_key_32_chars
PORT=5000
NODE_ENV=development
```

### 3) Frontend env
Create `.env` in project root:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4) Init DB
```bash
cd server
npm run db:init
cd ..
```

### 5) Start backend
```bash
cd server
npm run dev
```

### 6) Start frontend
In separate terminal:
```bash
cd MAMA-CIRCLE
npm run dev
```

### 7) Open
http://localhost:5173

### 8) Admin test account
- nickname: `admin`
- password: `Admin123!`

Create admin if needed (Postgres):
```bash
cd server
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('Admin123!', 10));"
psql "$DATABASE_URL" -c "INSERT INTO users (nickname,password,role,is_active) VALUES ('admin', '<HASH>', 'admin', true);"
```

### 9) Verify
- `http://localhost:5173` loads app
- `http://localhost:5000/api/health` returns {"status":"ok","db":"connected"}
- login with admin credentials works against `/api/auth/login`

---

## 🗂️ Key commands
- `npm run dev` (frontend)
- `cd server && npm run dev` (backend)
- `cd server && npm run db:init` (database)

## 🔧 API path hints
- `POST /api/auth/register` (`nickname`,`password`)
- `POST /api/auth/login` (`nickname`,`password`)
- `GET /api/admin/stats` (admin only, requires token)

---

## 👤 Notes
- This README is now minimal and accurate for your repo layout and live link.
- Make sure `.env` files are not committed.


Mama Circle addresses a critical gap in maternal mental health support across Africa. With 1 in 5 new mothers affected by postpartum depression and significant barriers to professional help, this platform provides:

- **Anonymous peer support** through moderated discussion forums and peer groups
- **Educational resources** on postpartum depression and maternal wellness
- **Mood tracking** for emotional wellbeing monitoring
- **24/7 community access** with real-time chat capabilities
- **Mobile-first design** optimized for low-bandwidth environments

---

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast builds and HMR
- **Tailwind CSS 4** for styling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **WebSocket** for real-time chat

### Backend
- **Node.js + Express 5** for REST API
- **PostgreSQL** (Neon) for data persistence
- **WebSocket (ws)** for real-time messaging
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

---

## 📁 Project Structure

```
MAMA-CIRCLE/
├── src/                          # Frontend (React + TypeScript)
│   ├── pages/                    # Page components
│   │   ├── Landing.tsx          # Public landing page
│   │   ├── Auth.tsx             # Login/Register
│   │   ├── Dashboard.tsx        # User dashboard
│   │   ├── Forums.tsx           # Discussion forums
│   │   ├── Groups.tsx           # Peer support groups
│   │   ├── Chat.tsx             # Real-time chat
│   │   └── Admin.tsx            # Admin panel
│   ├── components/
│   │   └── Navbar.tsx           # Navigation bar
│   ├── hooks/
│   │   └── useWebSocket.ts      # WebSocket hook for real-time features
│   ├── store/
│   │   ├── index.ts             # Redux store setup
│   │   └── slices/              # Redux slices (auth, chat, forums, groups)
│   ├── api.ts                   # Axios instance with auth interceptor
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── server/                       # Backend (Node.js + Express)
│   ├── index.js                 # Express app setup
│   ├── websocket.js             # WebSocket configuration
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── posts.js             # Forum posts endpoints
│   │   ├── groups.js            # Groups endpoints
│   │   ├── chat.js              # Chat endpoints
│   │   └── admin.js             # Admin endpoints
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Post.js              # Post model
│   │   ├── Group.js             # Group model
│   │   └── Comment.js           # Comment model
│   └── db/
│       ├── pool.js              # PostgreSQL connection pool
│       └── init.js              # Database initialization
├── public/                       # Static assets
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind CSS config
├── eslint.config.js             # ESLint configuration
└── package.json                 # Dependencies & scripts
```

### Important Files Explained

**Configuration Files:**
- `package.json` – Frontend dependencies and scripts
- `tsconfig.json` – TypeScript configuration
- `vite.config.ts` – Vite build tool configuration
- `.env` – Frontend environment variables (create this)

**Frontend Key Files:**
- `src/App.tsx` – Main app component, routes setup
- `src/api.ts` – Axios instance for API calls (sets auth headers)
- `src/store/index.ts` – Redux setup and store configuration
- `src/pages/\*.tsx` – Each page component (Landing, Auth, Dashboard, etc.)

**Backend Key Files:**
- `server/index.js` – Express app setup, route mounting
- `server/websocket.js` – WebSocket server configuration
- `server/db/pool.js` – PostgreSQL connection pool
- `server/routes/\*.js` – API route handlers
- `server/models/\*.js` – Database query functions

**Database:**
- `server/db/init.js` – Creates tables on first run

---

## 🚀 Getting Started

### Quick Start (TL;DR)

```bash
# Clone and setup
git clone https://github.com/your-username/MAMA-CIRCLE.git
cd MAMA-CIRCLE
npm install
cd server && npm install && cd ..

# Setup environment variables
# Edit .env in root: VITE_API_URL=http://localhost:5000/api
# Edit server/.env: DATABASE_URL=... and JWT_SECRET=...

# Initialize database
cd server && npm run db:init && cd ..

# Start both servers (in separate terminals)
# Terminal 1: npm run dev (from root)
# Terminal 2: cd server && npm run dev

# Open http://localhost:5173 in your browser
```

---

### Prerequisites

Before starting, ensure you have the following installed on your system:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
  - Check version: `node --version`
- **npm** v9+ (comes with Node.js)
  - Check version: `npm --version`
- **Git** ([Download](https://git-scm.com/))
- **PostgreSQL** 12+ (local installation) OR **Neon** (cloud database - recommended)
  - **Neon** is easier: Create a free account at [neon.tech](https://neon.tech/)

> **macOS tip:** Use Homebrew for easy installation: `brew install node git`

---

### Step-by-Step Installation Guide

#### **Step 1: Clone the Repository**

```bash
git clone https://github.com/your-username/MAMA-CIRCLE.git
cd MAMA-CIRCLE
```

Verify you're in the correct directory:
```bash
pwd  # Should end with /MAMA-CIRCLE
ls   # Should show src/, server/, package.json, etc.
```

---

#### **Step 2: Install Frontend Dependencies**

From the root directory (`MAMA-CIRCLE/`), install all React and frontend packages:

```bash
npm install
```

This creates a `node_modules/` folder with all dependencies. Takes 2-3 minutes.

Verify installation:
```bash
npm list react react-router-dom redux  # Shows installed versions
```

---

#### **Step 3: Install Backend Dependencies**

Navigate to the server folder and install backend dependencies:

```bash
cd server
npm install
cd ..
```

This installs Express, PostgreSQL driver, WebSocket library, etc.

Verify:
```bash
cd server && npm list express pg ws && cd ..
```

---

#### **Step 4: Set Up the Database**

**Option A: Using Neon (Cloud - Recommended)**

1. Go to [neon.tech](https://neon.tech/) and create a free account
2. Create a new project and database
3. Copy your connection string (looks like: `postgresql://user:password@host/database?sslmode=require`)
4. Keep this safe - you'll need it in Step 5

**Option B: Using Local PostgreSQL**

1. Install PostgreSQL locally
2. Create a new database:
   ```bash
   createdb mama_circle
   ```
3. Your connection string: `postgresql://postgres:your_password@localhost:5432/mama_circle`

---

#### **Step 5: Configure Environment Variables**

**Frontend Configuration:**

Create a `.env` file in the root directory (`MAMA-CIRCLE/.env`):

```env
# Frontend API endpoint - points to backend server
VITE_API_URL=http://localhost:5000/api
```

**Backend Configuration:**

Create a `.env` file in the server directory (`server/.env`):

```env
# Database connection (use Neon URL or local PostgreSQL connection string)
DATABASE_URL=postgresql://user:password@host/database

# JWT secret for authentication (use a random string - min 32 characters)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# Server port
PORT=5000

# Environment mode
NODE_ENV=development
```

> **⚠️ Important:** Never commit `.env` files. They contain secrets. `.env` files are already in `.gitignore`.

To generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it in `server/.env`

---

#### **Step 6: Initialize the Database**

From the server directory, create all necessary database tables:

```bash
cd server
npm run db:init
```

This runs `db/init.js` which creates tables for users, posts, groups, messages, etc.

Expected output:
```
✅ Database tables created successfully
Connected to: postgresql://...
```

If you get connection errors, double-check your `DATABASE_URL` in `server/.env`.

---

#### **Step 7: Start the Backend Server**

From the `server/` directory, start the Node.js server:

```bash
npm run dev
```

Expected output:
```
Server running on port 5000
WebSocket server listening
✅ Connected to database: postgresql://...
```

> The server will auto-reload when you make changes (using nodemon).

**Keep this terminal open.** Open a new terminal for the next step.

---

#### **Step 8: Start the Frontend Development Server**

From the root directory (`MAMA-CIRCLE/`), start Vite:

```bash
npm run dev
```

Expected output:
```
  VITE v7.1.7  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press 'h' for help
```

---

#### **Step 9: Open the Application**

Open your browser and go to:
```
http://localhost:5173
```

You should see the Mama Circle landing page.

---

### Verification Checklist

✅ **Frontend running?** Visit `http://localhost:5173` - should see landing page  
✅ **Backend running?** Visit `http://localhost:5000/api/health` - should show `{"status":"ok","db":"connected"}`  
✅ **Database connected?** Check server terminal - should say "Connected to database"  
✅ **Can you see errors?** Check browser console (`F12`) and server terminal for any errors  

---

### Troubleshooting

| Problem | Solution |
|---------|----------|
| **"npm: command not found"** | Install Node.js from [nodejs.org](https://nodejs.org/) |
| **"Cannot find module"** | Run `npm install` again from root and `cd server && npm install && cd ..` |
| **Database connection error** | Check `DATABASE_URL` in `server/.env` - verify credentials |
| **Port 5000 already in use** | Change `PORT` in `server/.env` to 5001, 5002, etc. |
| **Port 5173 already in use** | Vite will auto-increment to 5174, 5175, etc. |
| **CORS errors in browser** | Ensure backend is running on `http://localhost:5000` |
| **WebSocket connection failed** | Ensure backend server is fully running (see Step 7) |

---

### Stopping the Servers

To stop either server, press `Ctrl+C` in the terminal where it's running.

---

### What to Do After Setup

**1. Test the landing page (http://localhost:5173)**
   - Should load without errors
   - Desktop and mobile responsive views
   - Navigation works

**2. Create an account**
   - Click "Join free" button
   - Set a nickname (no real name needed)
   - Password (min 8 characters)
   - Should redirect to Dashboard

**3. Admin credentials (for testing/admin panel)**

This project includes an admin route in `server/routes/admin.js` (protected by JWT + admin flag). You can seed one admin user using the database or via API as follows:

Option A (database seed):
```bash
psql "${DATABASE_URL}" -c "INSERT INTO users (username, password_hash, role) VALUES ('admin', '<bcrypt-hash>', 'admin');"
```
- Replace `<bcrypt-hash>` with hashed password output from:
  `node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('Admin123!', 10));"`

Option B (API endpoint if available):
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"nickname":"admin","password":"Admin123!"}'
```
- Then login via:
  `curl -X POST http://localhost:5000/api/auth/login -H 'Content-Type: application/json' -d '{"nickname":"admin","password":"Admin123!"}'`

> NOTE: Your backend auth uses `nickname` + `password` (see `server/routes/auth.js`). Role assignment is in DB (`role = 'admin'`), or via admin-only route for role updates.

**4. Test admin panel access**
   - Go to admin route (e.g., `/admin` and/or `/api/admin/stats`)
   - Use admin JWT token from login response in `Authorization: Bearer <token>` header

**3. Test authentication**
   - Log out from Dashboard
   - Log back in with same credentials
   - Should work and stay logged in

**4. Check the database**
   - User should appear in `users` table
   - Verify with database client or:
   ```bash
   psql "your_database_url"
   SELECT * FROM users;
   ```

**5. Check backend logs**
   - Server terminal should show API requests
   - WebSocket connections should appear when opening chat

**6. Open browser developer tools**
   - Press `F12`
   - Check Console tab for any errors
   - Network tab shows API calls to `http://localhost:5000/api`

---

### Next Steps

- **Read the code:** Start with [src/App.tsx](src/App.tsx) to understand frontend structure
- **Explore API:** Check [server/routes/](server/routes/) to see all API endpoints
- **Modify components:** Edit [src/pages/](src/pages/) to customize features
- **Run tests:** Create test files and use Jest if needed
- **Deploy:** See **Deployment** section below

---

---

## 📜 Available Scripts

### Frontend Scripts (Run from root: `MAMA-CIRCLE/`)

```bash
npm run dev       # Start Vite dev server with hot reload (http://localhost:5173)
npm run build     # Compile TypeScript and bundle for production (creates dist/ folder)
npm run preview   # Preview the production build locally
npm run lint      # Check code for ESLint issues
```

**Common workflow:**
```bash
npm run dev       # ← Start here during development
# Make changes and save - browser auto-reloads
npm run lint      # Check for issues before committing
npm run build     # Build for production when ready to deploy
```

### Backend Scripts (Run from `server/` directory)

```bash
cd server
npm run dev       # Start backend with auto-reload (uses nodemon)
npm start         # Start backend (production mode - no auto-reload)
npm run db:init   # Initialize/reset database tables
cd ..
```

**Common workflow:**
```bash
cd server
npm run dev       # ← Start here during development
# Make changes and save - server auto-reloads
# Ctrl+C to stop
cd ..
```

### Running Both Simultaneously

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
# Runs on: http://localhost:5000/api
```

**Terminal 2 (Frontend):**
```bash
npm run dev
# Runs on: http://localhost:5173
```

Keep both terminals open side-by-side. Frontend will communicate with backend automatically.

---

## 🔑 Key Features

### 1. **Anonymous Authentication**
- Register with only a nickname (no real name, phone, or ID required)
- JWT-based session management
- Secure password hashing with bcryptjs

### 2. **Discussion Forums**
- Topic-based conversations
- Post and comment on others' experiences
- Moderation tools for safety

### 3. **Peer Support Groups**
- Curated circles for specific situations
- Small, moderated communities
- Real-time messaging via WebSocket

### 4. **Resource Library**
- Curated articles on postpartum depression
- Self-care guides
- Communication templates for partners/family

### 5. **Mood Tracker**
- Daily emotional check-ins
- Track wellbeing patterns over time
- Personal insights dashboard

### 6. **Real-time Chat**
- WebSocket-powered messaging
- Instant notifications with React Hot Toast
- Persistent message history

### 7. **Admin Panel**
- Content moderation
- User management
- Analytics and metrics

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login user
- `POST /api/auth/logout` – Logout user

### Posts & Forums
- `GET /api/posts` – Get all forum posts
- `POST /api/posts` – Create post
- `GET /api/posts/:id` – Get single post
- `PUT /api/posts/:id` – Update post
- `DELETE /api/posts/:id` – Delete post

### Groups
- `GET /api/groups` – Get all groups
- `POST /api/groups` – Create group
- `GET /api/groups/:id` – Get group details
- `POST /api/groups/:id/join` – Join group

### Chat
- `GET /api/chat/messages` – Get chat history
- `POST /api/chat/messages` – Send message (WebSocket)

### Admin
- `GET /api/admin/stats` – Get platform statistics
- `POST /api/admin/moderate/:postId` – Moderate content

---

## 🌐 WebSocket Events

Real-time communication uses WebSocket for instant updates:

- `message:new` – New chat message received
- `user:online` – User came online
- `user:offline` – User went offline
- `post:new` – New forum post created
- `notification:alert` – System notification

---

## 🗄 Database Schema

Key tables:
- **users** – User accounts (anonymous profiles)
- **posts** – Forum discussion posts
- **comments** – Replies to posts
- **groups** – Peer support groups
- **group_members** – Users in groups
- **messages** – Chat messages
- **mood_entries** – Daily mood tracking

---

## 🔒 Security Features

- ✅ Anonymous by design (no real identity stored)
- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ Content moderation system
- ✅ Database connection pooling
- ✅ Environment variable protection

---

## 🎨 Design Philosophy

Built specifically for the African context:
- **Low-bandwidth optimized** – Works on 3G/4G networks
- **Mobile-first** – Responsive design for all devices
- **Fast load times** – Vite + Tailwind CSS for performance
- **Culturally sensitive** – Language and imagery reflect African mothers' experiences
- **Accessibility** – Clear, simple language; WCAG considerations

---

## 📦 Deployment

You deployed on Vercel at: https://mama-circle-main1.vercel.app/dashboard

### Deploying with Vercel (only)

This project is configured for Vercel + separate backend API.

1. Push code to GitHub ([GitHub guide](https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository)).
2. On Vercel, click "Add New..." → "Project" → Import repository.
3. Confirm framework is detected as "Vite".
4. Set `VITE_API_URL` in Vercel environment variables to your backend URL (e.g. `https://<your-backend>.vercel.app/api` or `http://localhost:5000/api` for local dev).
5. Deploy and verify dashboard at `https://mama-circle-main1.vercel.app/dashboard`.

### Admin test account (for this deployment)

- Admin username: `admin`
- Admin password: `Admin123!`

#### Create admin user in database (if not created yet)

From server directory:

```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('Admin123!', 10));"
```

Copy hash and run:

```bash
psql "$DATABASE_URL" -c "INSERT INTO users (username, password_hash, role) VALUES ('admin', '<hash>', 'admin');"
```

Or via API (if role writable):

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"Admin123!","role":"admin"}'
```

Then login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"Admin123!"}'
```

Use returned token for `Authorization: Bearer <token>` on `/api/admin` endpoints.

---

## 👩‍💻 Contributors

**Student Project:** Gakwaya Ineza Ketia
     PORT=10000
     ```

4. **Deploy:** Render auto-deploys on push

#### **Option 2: Railway.app (Simple & Fast)**

1. **Push code to GitHub**

2. **Create Railway project:**
   - Go to [railway.app](https://railway.app)
   - New Project → GitHub Repo → Select MAMA-CIRCLE

3. **Configure environment:**
   - Add variables: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`

4. **Deploy:** Railway auto-deploys

#### **Option 3: Heroku (Paid only now)**

Heroku's free tier is gone, but the process is similar - follow their documentation.

---

### Update Frontend After Backend Deployed

After backend is live at `https://your-api.com`, update frontend:

**In Vercel/Netlify dashboard:**
- Environment Variables → `VITE_API_URL=https://your-api.com/api`
- Redeploy

**Or update locally before deploying:**
```bash
# .env file
VITE_API_URL=https://your-api.com/api
npm run build
# Then deploy dist/ folder
```

---

### Post-Deployment Checklist

- ✅ Frontend loads at your URL
- ✅ Can register new account
- ✅ Can log in/log out
- ✅ Check backend health: `https://your-api.com/api/health`
- ✅ Database has user data
- ✅ WebSocket chat works (open DevTools → Network, filter "ws")
- ✅ No errors in browser console

---

### Database Notes

- **Neon (recommended):** Free tier supports 3 projects, auto-scales
- **Local PostgreSQL:** Works for development but not recommended for production
- **Backup:** Use Neon's backup feature or `pg_dump` for local backups
  ```bash
  pg_dump "your_database_url" > backup.sql
  ```

---

## 👩‍💻 Contributors

**Student Project:** Gakwaya Ineza Ketia

---

## 📄 License

ISC

---

## 💬 Support

For issues, questions, or feedback, please open an issue on GitHub.

---

**Mama Circle: Every mother deserves a circle of warmth — especially in her most vulnerable hours.**

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
