# Expense Tracker API

A Node.js **RESTful API** for tracking personal expenses with **user authentication**, built using **Express** and **MongoDB (Mongoose)**. The application supports JWT-based authentication, HTTP-only cookies, and full CRUD operations for expenses, and also serves basic HTML views for login and expense management.

Project from https://roadmap.sh/projects/expense-tracker-api

## Prerequisites

- Node.js
- Express
- MongoDB (local instance or managed service such as MongoDB Atlas)

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd expense-tracker-api
```

2. **Install dependencies**

```bash
npm install
```

## Configuration

### Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

- `PORT` – Port the server runs on
- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – Secret for signing access tokens
- `JWT_REFRESH_SECRET` – Secret for signing refresh tokens

## Running the Application

### Start the application

```bash
npm start
```

The server will start at:

```
http://localhost:3000
```

## Authentication

- Uses **JWT access tokens** for API authorization
- Uses **HTTP-only cookies** for refresh tokens and session handling
- Protected routes are guarded by authentication middleware

### Auth Routes

| Method | Endpoint | Description |
|------|---------|------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in and receive tokens |
| POST | `/auth/logout` | Log out and clear cookies |
| POST | `/auth/refresh` | Refresh access token |

## Expense API

All expense routes require authentication.

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/expenses` | Get all expenses |
| GET | `/expenses/:id` | Get a single expense |
| POST | `/expenses` | Create a new expense |
| PUT | `/expenses/:id` | Update an expense |
| DELETE | `/expenses/:id` | Delete an expense |

## Views

The server also serves basic HTML views for user interaction:

- Login page
- Expense list page

These are located under the `public/views` directory and are served via the view router.

## Notes

- MongoDB connection is initialized on server startup
- JWT handling logic is centralized in `src/utils/jwt.js`
- The project follows an **MVC-inspired** structure

## License

This project is licensed under the ISC License.

