# EduConnect — Full-Stack Student & Professional Platform

EduConnect is a MERN-style application with React/Vite, Express, MongoDB/Mongoose, JWT authentication, RBAC, resources, internships/jobs, applications, networking, feed, messaging, notifications, and basic administration APIs.

## Requirements
- Node.js 18+ (20+ recommended)
- MongoDB local instance or MongoDB Atlas

## Run locally

### 1. Backend
```bash
cd backend
npm install
````
Copy `backend/.env.example` to `backend/.env`, then set `MONGO_URI` and a long random `JWT_SECRET`. For email verification and password reset, configure valid SMTP credentials.

Windows PowerShell: `Copy-Item .env.example .env` (run from `backend`).

```bash
npm run dev
```
Backend default: `http://localhost:5000`; health check: `/api/health`.

### 2. Frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL (usually `http://localhost:5173`).

## Main API routes
- `/api/auth`: registration, login, email verification, password reset/change, current user
- `/api/users`: profiles and directory
- `/api/resources`: academic resource search and uploads (multipart field `file`)
- `/api/jobs`: jobs/internships and applications
- `/api/connections`: connection requests
- `/api/posts`: community feed, likes and comments
- `/api/messages`: direct messaging
- `/api/notifications`: personal notifications
- `/api/admin`: admin statistics and user status management

Protected endpoints require `Authorization: Bearer <JWT>`. Public registration allows only Student and Professional roles. Admin accounts must be created by a trusted administrator through a controlled database/bootstrap process; never accept an Admin role from registration.

## Email configuration
Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, and `FRONTEND_URL`. Gmail typically requires an App Password when 2-Step Verification is enabled; do not use your normal account password. In development only, if SMTP is absent, registration returns a `developmentVerificationToken` for local testing. This shortcut is disabled outside development.

## Security notes
Passwords are hashed with bcrypt. Verification/reset tokens are random, single-use, hashed in the database, and expire. JWT authentication and role checks happen on the server. Uploaded files are limited by extension and size; production should add content-signature inspection and use private object storage. Review CORS, SMTP, backups, rate limits, logging, and deployment settings before production.

## Test manually with Postman
1. `POST /api/auth/register` with `{ "name":"Test Student", "email":"student@example.com", "password":"ExamplePass123", "role":"Student" }`.
2. Verify via email link/token (or development token if SMTP is not configured in development).
3. `POST /api/auth/login` with email and password; copy `token`.
4. Set Bearer Token in Postman for protected routes.
5. Register a Professional user and test `POST /api/jobs` with a JSON body containing `title`, `company`, `description`, and `type` (`Internship` or `Job`).
6. Test resource uploads as `multipart/form-data` with a `file`, `title`, and `subject`.

This is a substantial project starter, not a certification of production readiness. Run the application against your own MongoDB and SMTP environment and complete functional/security testing before deployment.
