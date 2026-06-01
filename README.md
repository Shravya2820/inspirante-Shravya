# College Event Registration Portal

A full-stack web application built for the Inspirante Web Development Internship Assignment. The portal allows administrators to manage events and students to register for them.

## Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js + Express.js
* Database: MySQL
* Authentication: Session-based authentication

## Prerequisites

Before running the project, install:

* Node.js
* MySQL Server
* VS Code Live Server extension (or any static file server)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Shravya2820/inspirante-Shravya.git
cd inspirante-Shravya
```

### 2. Create the Database

```sql
CREATE DATABASE inspirante_db;
```

Import the schema:

#### macOS/Linux

```bash
mysql -u root -p inspirante_db < backend/schema.sql
```

#### Windows (PowerShell)

```powershell
cmd /c "mysql -u root -p inspirante_db < backend\schema.sql"
```

### 3. Configure Environment Variables

#### macOS/Linux

```bash
cp backend/.env.example backend/.env
```

#### Windows (PowerShell)

```powershell
copy backend\.env.example backend\.env
```

Update `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=inspirante_db
SESSION_SECRET=your-secret-key
PORT=3000
```

### 4. Install Dependencies

```bash
cd backend
```

#### macOS/Linux

```bash
npm install
```

#### Windows (PowerShell)

```powershell
npm.cmd install
```

### 5. Seed the Database

#### macOS/Linux

```bash
npm run seed
```

#### Windows (PowerShell)

```powershell
npm.cmd run seed
```

### 6. Start the Backend

#### macOS/Linux

```bash
npm start
```

#### Windows (PowerShell)

```powershell
npm.cmd start
```

The API will run at:

```text
http://localhost:3000
```

### 7. Start the Frontend

Open the `frontend` folder using VS Code Live Server and open `index.html`.

### 8. Login Credentials

#### Admin

* Username: admin
* Password: inspirante2026

#### Student

* Username: asha.rao
* Password: student123

All other student accounts specified in the assignment are included in the seed data.

## Features

### Admin

* Login
* Create events
* View all events
* View registrations for an event
* Capacity percentage with required color coding

### Student

* Login
* Browse upcoming events
* Events sorted by date
* Register for events
* Duplicate registration prevention
* View personal registrations

### System

* Session-based authentication
* REST API using `/api/*` routes
* MySQL data persistence
* Responsive UI
* User-friendly error handling

## Useful Commands

Run tests:

```powershell
cd backend
npm.cmd test
```

Reset sample data:

```powershell
cd backend
npm.cmd run seed
```

## Known Limitations

* Passwords are stored in plain text because user registration was not required.
* The default Express session store is used and is suitable only for development environments.


# College Event Registration Portal

A full-stack web application built for the Inspirante Web Development Internship Assignment.

The portal allows administrators to create and manage events, while students can browse events and register for them.

## Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js + Express.js
* Database: MySQL
* Authentication: Session-based authentication

## Prerequisites

Before running the project, make sure the following are installed:

* Node.js
* MySQL Server
* VS Code Live Server extension (or any static file server)

> Note: On Windows PowerShell, use `npm.cmd` instead of `npm` if script execution is blocked.

---

## Setup Instructions

### Step 1: Clone the Repository

```powershell
git clone <repository-url>
cd inspirante-shravya
```

### Step 2: Create the Database

Open MySQL and run:

```sql
CREATE DATABASE inspirante_db;
```

Then import the schema:

```powershell
cmd /c "mysql -u root -p inspirante_db < backend\schema.sql"
```

Enter your MySQL password when prompted.

### Step 3: Configure Environment Variables

Copy the example environment file:

```powershell
copy backend\.env.example backend\.env
```

Open `backend\.env` and update the values:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=inspirante_db
SESSION_SECRET=your-secret-key
PORT=3000
```

### Step 4: Install Dependencies

```powershell
cd backend
npm.cmd install
```

### Step 5: Seed the Database

This creates the sample users and events required for the assignment.

```powershell
npm.cmd run seed
```

### Step 6: Start the Backend Server

```powershell
npm.cmd start
```

The API will run at:

```text
http://localhost:3000
```

### Step 7: Start the Frontend

Open the `frontend` folder using VS Code Live Server.

The frontend will open in the browser at:

```text
http://127.0.0.1:5500
```

### Step 8: Log In

#### Admin Account

Username: `admin`

Password: `inspirante2026`

#### Student Account

Username: `asha.rao`

Password: `student123`

Additional student accounts from the assignment are included in the seed file.

---

## Features

### Admin

* Login
* Create events
* View all events
* View registrations for any event
* View event capacity percentage with color coding

### Student

* Login
* View upcoming events sorted by date
* Register for events
* Duplicate registration prevention
* View personal registrations

### System

* Session-based authentication
* REST API with `/api/*` routes
* MySQL persistence
* Responsive UI
* User-friendly error handling

---

## Project Structure

```text
backend/
frontend/
README.md
DECISIONS.md
```

---

## Useful Commands

Run backend tests:

```powershell
cd backend
npm.cmd test
```

Reset sample data:

```powershell
cd backend
npm.cmd run seed
```

---

## Known Limitations

* Passwords are stored in plain text because user registration and password management were outside the scope of this assignment.
* The default Express memory session store is used and should be replaced for a production application.
