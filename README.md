# Expense Tracker API

![Node.js v25](https://img.shields.io/badge/node-v25.x-brightgreen)
![Express](https://img.shields.io/badge/express-5.x-blue)
![MongoDB](https://img.shields.io/badge/mongodb-mongoose-green)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

A RESTful **Expense Tracker API** built with **Node.js (v25)**, **Express**, and **MongoDB (Mongoose)**. The API supports secure user authentication using **JWT (access + refresh tokens)**, cookie-based sessions, and full CRUD operations for managing personal expenses. It follows an MVC-style project structure and is designed to be consumed by a frontend client (Demo included).

---

## 📦 Features

- User authentication (register, login, logout)
- JWT-based access & refresh token flow
- HTTP-only cookie support
- Expense CRUD operations
- MongoDB persistence via Mongoose
- Middleware-based request authentication
- MVC-inspired folder structure
- Environment-based configuration

---

## 🧱 Project Structure

```text
Expense Tracker API/
├── server.js
├── package.json
├── .env
├── public/
└── src/
    ├── controllers/
    │   ├── authController.js
    │   └── expenseController.js
    ├── databases/
    │   └── dbClient.js
    ├── middlewares/
    │   └── authenticator.js
    ├── models/
    │   ├── userModel.js
    │   └── expenseModel.js
    ├── routers/
    │   ├── authRouter.js
    │   ├── expenseRouter.js
    │   └── viewRouter.js
    └── utils/
        └── jwt.js
```

---

## ⚙️ Tech Stack

| Layer     | Technology    |
| --------- | ------------- |
| Runtime   | Node.js v25   |
| Framework | Express 5     |
| Database  | MongoDB       |
| ODM       | Mongoose      |
| Auth      | JWT, bcrypt   |
| Cookies   | cookie-parser |
| Config    | dotenv        |

---

## 🔐 Authentication & Session Cookie Flow

This API uses **three tokens**:

- **Access Token** (JWT) — returned in JSON on login/refresh and intended to be sent as a `Bearer` token.
- **Refresh Token** (JWT) — stored as an **HTTP-only cookie** named `refreshToken` (7 days).
- **Session Token** (JWT) — stored as an **HTTP-only cookie** named `sessionToken` (1 hour).

### What the cookies do

- `refreshToken` is the long-lived credential used to **re-establish a session** and to **mint a new access token**.
- `sessionToken` acts as a **short-lived session cookie** (a “sliding” session) that can be refreshed server-side.

### Login

On successful login, the server:

1. Generates `accessToken`, `refreshToken`, and `sessionToken`
2. Sets cookies:
   - `refreshToken` (HTTP-only, `sameSite: strict`, 7 days)
   - `sessionToken` (HTTP-only, `sameSite: strict`, 1 hour)
3. Returns `accessToken` in the JSON response

### Protected route behavior (middleware-driven session refresh)

For protected API routes, the `authApi` middleware enforces authentication in this order:

1. **Verify Bearer access token** from `Authorization: Bearer <token>`
2. If access token is invalid/expired, **verify `sessionToken` cookie**
3. If the session token is invalid/expired, **verify `refreshToken` cookie**, mint a **new `sessionToken`**, and set it back as a cookie

This results in a **sliding session** experience: as long as the refresh token is valid, the server can refresh the short-lived session token automatically.

### Refresh access token (`/auth/refresh`)

The `/auth/refresh` endpoint uses the **`refreshToken` cookie** to mint and return a **new `accessToken`** in JSON.

---

## 📡 API Endpoints

### Auth Routes

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| POST   | `/auth/register` | Register a new user        |
| POST   | `/auth/login`    | Authenticate user          |
| POST   | `/auth/logout`   | Clear refresh token cookie |

### Expense Routes (Protected)

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| GET    | `/expenses`     | Get all expenses   |
| GET    | `/expenses/:id` | Get single expense |
| POST   | `/expenses`     | Create expense     |
| PUT    | `/expenses/:id` | Update expense     |
| DELETE | `/expenses/:id` | Delete expense     |

> All expense routes require a valid **Bearer access token**.

---

## 🧪 Example Request

```http
GET /api/expenses
Authorization: Bearer <access_token>
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/farhank08/expense-tracker-api.git
cd expense-tracker-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=3000 (Optional, default = 5000)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

### 4. Start the server

```bash
npm start
```

Server and client demo runs at:

```
http://localhost:3000
```

---

## 🛡️ Middleware

- **authenticator.js**
  - Validates JWT access tokens
  - Protects private routes

---

## 🧠 Architecture Overview

```text
Client
  │
  ├── Authorization: Bearer Token
  │
Express Router
  │
Controllers
  │
Models (Mongoose)
  │
MongoDB
```

---

## 📄 License

This project is licensed under the ISC License.

---
