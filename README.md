# College Event Registration Portal

A full-stack web application built for the Inspirante Web Development Internship Assignment. The portal allows administrators to manage events and students to register for them.

## Live Demo

| | URL |
|---|---|
| Frontend | https://inspirante-shravya.vercel.app |
| Backend API | https://inspirante-shravya.onrender.com |

> The live demo uses a cloud MySQL database (Aiven) — no local setup needed to try it out.

---

## Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js + Express.js
* Database: MySQL
* Authentication: Session-based authentication

---

## Prerequisites

Make sure the following are installed on your machine:

* [Node.js](https://nodejs.org) (v18 or above)
* [MySQL Server](https://dev.mysql.com/downloads/mysql/) (v8 or above)
* [Git](https://git-scm.com)
* VS Code with the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) — or any static file server

---

## Local Setup — Step by Step

### Step 1: Clone the Repository

```bash
git clone https://github.com/Shravya2820/inspirante-Shravya.git
cd inspirante-Shravya
```

---

### Step 2: Set Up the Database

Open your MySQL client and run:

```sql
CREATE DATABASE IF NOT EXISTS inspirante_db;
```

Then import the schema.

**macOS / Linux:**
```bash
mysql -u root -p inspirante_db < backend/schema.sql
```

**Windows (Command Prompt):**
```cmd
mysql -u root -p inspirante_db < backend\schema.sql
```

**Windows (PowerShell):**
```powershell
cmd /c "mysql -u root -p inspirante_db < backend\schema.sql"
```

Enter your MySQL password when prompted.

---

### Step 3: Configure Environment Variables

**macOS / Linux:**
```bash
cp backend/.env.example backend/.env
```

**Windows (Command Prompt):**
```cmd
copy backend\.env.example backend\.env
```

**Windows (PowerShell):**
```powershell
Copy-Item backend\.env.example backend\.env
```

Now open `backend/.env` and fill in your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=inspirante_db
DB_PORT=3306
SESSION_SECRET=any-random-string-you-choose
PORT=3000
NODE_ENV=development
```

> `SESSION_SECRET` can be any random string — for example `mySecretKey123`. It just needs to be set.

---

### Step 4: Install Dependencies

```bash
cd backend
npm install
```

---

### Step 5: Seed the Database

This populates the database with sample users and events.

```bash
npm run seed
```

You should see:
```
MySQL connected
Database reset and seeded
```

---

### Step 6: Start the Backend

```bash
npm start
```

You should see:
```
Server running on port 3000
MySQL connected
```

The API is now running at `http://localhost:3000`.

---

### Step 7: Start the Frontend

1. Open the `frontend` folder in VS Code
2. Right-click `index.html` → **Open with Live Server**

The app will open in your browser at `http://127.0.0.1:5500`.

---

### Step 8: Log In

**Admin:**
| Username | Password |
|---|---|
| `admin` | `inspirante2026` |

**Student (any of these):**
| Name | Username | Password |
|---|---|---|
| Asha Rao | `asha.rao` | `student123` |
| Ravi Shetty | `ravi.shetty` | `student123` |
| Meera Nair | `meera.nair` | `student123` |
| Kiran Bhat | `kiran.bhat` | `student123` |
| Divya Kamath | `divya.kamath` | `student123` |
| Suresh Pai | `suresh.pai` | `student123` |
| Ananya Hegde | `ananya.hegde` | `student123` |
| Rohan Shenoy | `rohan.shenoy` | `student123` |
| Nisha Prabhu | `nisha.prabhu` | `student123` |
| Tejas Mallya | `tejas.mallya` | `student123` |
| Priya Bangera | `priya.bangera` | `student123` |

---

## Features

### Admin
* Login
* Create events (name, date, venue, capacity)
* View all events with registration count
* View full registrations list for any event
* Capacity fill % with color coding: green (below 50%) / amber (50–79%) / red (80%+)

### Student
* Login
* Browse upcoming events sorted by date
* Register for events (disabled + marked Full when at capacity)
* Duplicate registration prevention with clear error message
* View personal registrations

### System
* Session-based authentication with protected routes
* REST API with `/api/*` prefix on all routes
* MySQL data persistence
* Error handling on every API call — errors shown to the user clearly

---

## Project Structure

```
backend/
  routes/
    auth.js            # /api/auth — login, logout, current user
    events.js          # /api/events — list, create, registrations
    registrations.js   # /api/registrations — register, my registrations
  middleware/
    auth.js            # requireLogin and requireAdmin middleware
  db.js                # MySQL connection
  server.js            # Express app entry point
  schema.sql           # Database schema (run once to set up tables)
  seed.js              # Populates sample users and events
  .env.example         # Environment variable template
frontend/
  css/
    styles.css
  js/
    app.js             # Main app logic and rendering
    auth.js            # Login / logout / current user calls
    events.js          # Events API calls + API base URL config
    registrations.js   # Registration API calls
  index.html
README.md
DECISIONS.md
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `yourpassword` |
| `DB_NAME` | Database name | `inspirante_db` |
| `DB_PORT` | MySQL port | `3306` |
| `SESSION_SECRET` | Secret for signing sessions | `anyRandomString` |
| `PORT` | Port the server runs on | `3000` |
| `NODE_ENV` | Set to `production` when deploying | `development` |

---

## Useful Commands

| Command | What it does |
|---|---|
| `npm install` | Install backend dependencies |
| `npm start` | Start the backend server |
| `npm run seed` | Reset and repopulate sample data |
| `npm test` | Syntax check all backend files |

---

## Known Limitations

* Passwords are stored in plain text because user registration was not required by the assignment.
* The default Express memory session store is used — suitable for development and demo, not for large-scale production.