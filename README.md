# Employee Attendance Management System (MERN-style, MySQL backend)

A full-stack rewrite of the Employee Attendance Management System, covering
the same features as the original Java/JSP report: authentication,
department management (equivalent to the report's "District" module),
employee records, and attendance marking/reporting.

## Stack

- **MySQL** + **Sequelize** — data layer (swapped in for MongoDB since you're
  running MySQL locally)
- **Express** + **Node.js** — REST API
- **React** (CRA, functional components + hooks) — frontend
- **JWT** — authentication, **bcryptjs** — password hashing

## Project structure

```
employee-attendance-mern/
├── server/                     # Express API
│   ├── config/db.js             # Sequelize connection + sync
│   ├── models/                  # User, Department, Employee, Attendance
│   ├── middleware/              # auth (JWT + role guard), error handler
│   ├── controllers/             # business logic per resource
│   ├── routes/                  # /api/auth, /departments, /employees, /attendance
│   ├── server.js
│   └── package.json
└── client/                     # React frontend
    ├── public/index.html
    └── src/
        ├── api/axios.js         # axios instance + auth header + 401 handling
        ├── context/AuthContext.js
        ├── components/          # Navbar, PrivateRoute
        ├── pages/                # Login, Register, Dashboard, Departments,
        │                         # Employees, Attendance
        ├── App.js
        └── index.js
```

## API overview

| Method | Route                              | Access        |
|--------|-------------------------------------|---------------|
| POST   | `/api/auth/register`                | public        |
| POST   | `/api/auth/login`                   | public        |
| GET    | `/api/auth/me`                      | logged in     |
| GET    | `/api/departments`                  | logged in     |
| POST/PUT/DELETE | `/api/departments[/:id]`  | admin only    |
| GET    | `/api/employees`                    | logged in     |
| POST/PUT/DELETE | `/api/employees[/:id]`    | admin only    |
| POST   | `/api/attendance/mark`              | logged in     |
| GET    | `/api/attendance/employee/:id`      | logged in     |
| GET    | `/api/attendance/report/:id`        | logged in     |
| GET    | `/api/attendance?date=YYYY-MM-DD`   | admin only    |

## Running locally

### 1. MySQL
Make sure MySQL is running locally, then create the database:
```sql
CREATE DATABASE employee_attendance;
```
That's it — Sequelize will create all the tables (`users`, `departments`,
`employees`, `attendance`) automatically on first run via `sequelize.sync()`.

### 2. Backend
```bash
cd server
cp .env.example .env      # fill in DB_USER, DB_PASSWORD, and a JWT_SECRET
npm install
npm run dev                # starts on http://localhost:5000
```
You should see `MySQL connected` and `Models synced` in the terminal —
that confirms the tables were created.

### 3. Frontend
```bash
cd client
cp .env.example .env       # points to http://localhost:5000/api by default
npm install
npm start                  # starts on http://localhost:3000
```

### 4. Try it
- Register a user (defaults to role `employee`). To create an admin, either
  register normally then update the `role` column to `"admin"` directly in
  the `users` table, or temporarily send `role: "admin"` in the register
  request body.
- Log in as admin → add Departments → add Employees → go to Attendance to
  mark and view records.
- Log in as a regular employee → go to Attendance to mark/view your own
  history.

## Notes / next steps

- There's no automatic link between a logged-in employee's `User` account
  and their `Employee` record yet (the `employeeId` foreign key on `User`
  exists for this — wire it up in `createEmployee`/registration if you want
  employees restricted to only marking their *own* attendance rather than
  picking from a full list).
- `sequelize.sync({ alter: true })` is convenient for development (it
  auto-creates/updates tables to match your models) but isn't safe for
  production — switch to proper Sequelize migrations before deploying.
- No frontend styling framework is included — the pages use plain inline
  styles so you can restyle with Tailwind/MUI/whatever you prefer without
  fighting existing CSS.
- Passwords are hashed with bcrypt; nothing else security-sensitive
  (rate limiting, refresh tokens, etc.) is implemented — add before any
  real deployment.

## Pushing to GitHub

```bash
cd employee-attendance-mern
git init
git add .
git commit -m "Initial commit: MERN employee attendance management system"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

`server/.gitignore` and `client/.gitignore` already exclude `node_modules/`,
`.env`, and build output, so those won't get committed.
