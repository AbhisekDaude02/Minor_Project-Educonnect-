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

## Frontend section troubleshooting

After starting both services, open the Vite URL (normally `http://localhost:5173`) rather than the backend root URL. Sign in, then use the sidebar links for Feed, Academic Resources, Jobs & Internships, Network, Messages, and Profile. These sections require a valid logged-in session and a running MongoDB-backed API. If a section displays an error, check the browser DevTools Network tab and the backend terminal; the page now shows request failures instead of failing silently.

Jobs and Internships supports browsing and search for signed-in users, applying as a Student, and publishing/managing postings as a Professional. Resource upload accepts PDF, DOC/DOCX, PPT/PPTX, TXT, PNG, and JPG files up to 15 MB.


## Futuristic UI and Cloudinary profile images

The frontend now includes a dark neon-glass theme, animated sidebar and gravity-style button hover, a warm toggle lamp on login, a glass verification screen, and an About page.

### Cloudinary setup
1. Create a Cloudinary account and open **Settings → Upload → Upload presets**.
2. Create an **unsigned** upload preset. Restrict it to image uploads and set an appropriate 5 MB limit.
3. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`.
4. Restart the Vite dev server after changing `.env`.

Profile photos upload directly to Cloudinary and the resulting HTTPS URL is saved through the authenticated `PUT /api/users/me` endpoint. Do not put Cloudinary API secrets in frontend environment variables.

### Email verification
The existing backend sends a secure, expiring email verification link (24 hours) using SMTP. The updated glass verification screen styles that existing flow; it does not convert the backend flow into a numeric OTP. Configure SMTP in `backend/.env` to send real verification emails.
