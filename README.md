# Movie App Backend

A RESTful API built with Node.js, Express, and Prisma for searching and filtering movie and TV show content with user authentication and age-based access control.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Routes](#api-routes)
  - [Authentication](#authentication)
  - [Content Search](#content-search)
- [Error Handling](#error-handling)

## Prerequisites

- Node.js v14 or higher
- npm (comes with Node.js)
- MongoDB database (local or Atlas)

## Installation

1. Clone the repository and navigate to the folder:
   ```bash
   git clone <repo-url>
   cd movies-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables
Create a `.env` file in the root directory of the project. 
Edit `.env` and configure:

```env
DATABASE_URL="mongodb+srv://<user>:<password>@cluster0.mongodb.net/movies-app?retryWrites=true&w=majority"
JWT_SECRET="your_jwt_secret"
PORT=5000
```

## Database Setup

This project uses Prisma ORM with MongoDB.

1. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
2. (Optional) Inspect schema in `prisma/schema.prisma`. No migrations are required for MongoDB.

## Running the Server

Start the API server:

```bash
npm start
```

By default, the server runs on `http://localhost:5000`.

## API Routes

### Authentication

Base URL: `/api/auth`

| Method | Endpoint   | Description             | Body                                 | Response                       |
| ------ | ---------- | ----------------------- | ------------------------------------ | ------------------------------ |
| POST   | `/signup`  | Register a new user     | `{ email, password, age }`           | `{ id, email, age, token }`    |
| POST   | `/login`   | Log in an existing user | `{ email, password }`                | `{ id, email, age, token }`    |

**Example**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret","age":25}'
```

### Content Search

Base URL: `/api/content`

#### GET `/search`

Protected route (requires JWT in `Authorization` header).

**Query Parameters**

- `q` (string): search term
- `by` (string): `title`, `cast`, or omitted (search both)
- `type` (string): `Movie` or `TV Show`
- `category` (string): genre name (e.g., `Comedies`)
- `page` (number, default `1`): page number
- `limit` (number, default `15`): items per page

**Headers**

```
Authorization: Bearer <token>
```

**Response**

```json
{
  "data": [ /* array of content objects */ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 15,
    "totalPages": 7
  }
}
```

> Users under 18 years old will have content with `rating: 'R'` automatically filtered out.

## Error Handling

Errors are returned in JSON with appropriate HTTP status codes:

```json
{
  "message": "Error description"
}
```

- `400`: Bad Request / Validation errors
- `401`: Unauthorized / Invalid token
- `500`: Internal Server Error

---

