# EaseOps Assignment — REST API

Brief README for the EaseOps assignment project. It describes the project flow, how to set up and run the app, and common API calls to exercise the server.

## Project Overview

- **Purpose**: A simple Node.js REST API with authentication, user management, books (ebooks) upload, bookmarks, and FAQs.
- **Location**: Source code lives in the `src/` folder. Key modules:
  - `src/server.js` — HTTP server setup
  - `src/app.js` — Express app configuration
  - `src/db.js` — Database connection
  - `src/controllers/` — Route handlers (`authController.js`, `bookController.js`, `faqController.js`, `userController.js`)
  - `src/routes/` — Route definitions (`authRoutes.js`, `bookRoutes.js`, `faqRoutes.js`, `userRoutes.js`)
  - `src/middlewares/` — Middleware (`authMiddleware.js`, `uploadMiddleware.js`, `requireAdmin.js`, `uploadRateLimiter.js`)
  - `uploads/ebooks/` — Uploaded ebook files

## Architecture & Flow

- Client makes HTTP requests to route endpoints defined under `src/routes/`.
- Authentication uses JWT tokens (returned by login). Protected routes require an `Authorization: Bearer <token>` header.
- File uploads (ebooks) use a multipart upload middleware; files are stored in `uploads/ebooks/`.
- Admin-only operations are gated by the `requireAdmin` middleware.

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- A running MongoDB instance (or the database you use); set its connection string in environment variables.

## Setup

1. Clone the repo and change to project directory:

```powershell
cd d:\projects\pocs\assignment\easeops-ass2
```

2. Install dependencies:

```powershell
npm install
```

3. Create a `.env` file in the project root (example values):

```
MONGO_URI=mongodb://localhost:27017/easeops-ass2
JWT_SECRET=jwt_secret_key
PORT=3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=pratyakshp12.pp29@gmail.com
SMTP_PASS=mvaeyjvihylwqmzo
```

4. Start the server:

```powershell
npm start
# or for development with nodemon (if available):
npm run dev
```

The server listens on the port set in `PORT` (default 3000).

## Common API Endpoints

Base URL assumption: `http://localhost:3000` (adjust `PORT` as needed).

Authentication
- Register: `POST /api/auth/register`
  - Body (JSON): `{ "name": "Alice", "email": "alice@example.com", "password": "secret" }`
  - Response: user object (no password) and/or success message.

- Login: `POST /api/auth/login`
  - Body (JSON): `{ "email": "alice@example.com", "password": "secret" }`
  - Response: `{ "token": "<jwt>" }` — use this token for protected routes.

Users
- Get profile: `GET /api/users/me` (protected)
  - Header: `Authorization: Bearer <token>`

- Update profile: `PUT /api/users/me` (protected)
  - Body: JSON fields to update (name, email, etc.)

Books (ebooks)
- List books: `GET /api/books`

- Get book: `GET /api/books/:id`

- Create book (with file upload): `POST /api/books` (protected; may require admin)
  - Content-Type: `multipart/form-data`
  - Fields: `title` (text), `author` (text), `file` (file field for the ebook)

- Update book: `PUT /api/books/:id` (protected/admin)

- Delete book: `DELETE /api/books/:id` (protected/admin)

Bookmarks
- Add bookmark: `POST /api/books/:id/bookmark` (protected)
- Remove bookmark: `DELETE /api/books/:id/bookmark` (protected)

FAQs
- List FAQs: `GET /api/faqs`
- Create FAQ: `POST /api/faqs` (protected/admin)

Admin-only
- Any route gated by `src/middlewares/requireAdmin.js` requires the authenticated user to have admin privileges.

## Example cURL Requests

- Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
```

- Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret"}'
```

- Get books (public)

```bash
curl http://localhost:3000/api/books
```

- Create book with upload (example)

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer <TOKEN>" \
  -F "title=My Ebook" \
  -F "author=Author Name" \
  -F "file=@C:\\path\\to\\ebook.pdf"
```

- Access protected route example

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/users/me
```

## Uploads

- Uploaded ebook files are stored under `uploads/ebooks/`. Ensure this folder exists and the process has write permission.

- The project likely contains an `uploadMiddleware` and optional rate limiter in `src/middlewares/` to limit abuse.

## Notes & Tips

- Check `src/db.js` for database connection details and adjust the `MONGODB_URI` accordingly.
- The token returned by login should be sent in the `Authorization` header as `Bearer <token>`.
- Admin operations use `requireAdmin.js`. If you need to create an admin user directly, you can set the `role` field to `admin` in the database for a user document.

## Where to Look in the Codebase

- Route definitions: `src/routes/*.js`
- Controllers: `src/controllers/*.js`
- Middlewares: `src/middlewares/*.js`
