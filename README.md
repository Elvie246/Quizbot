# Quizbot Technical Documentation

![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![NestJS](https://img.shields.io/badge/NestJS-backend-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-black)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

An AI-powered quiz generation platform that allows users to create interactive study materials from text or uploaded documents.

---

## Table of Contents
1. [Project Description](#project-description)
2. [System Architecture (DDD)](#system-architecture-ddd)
3. [Stack Decisions](#stack-decisions)
4. [Data Model](#data-model)
5. [JWT Authentication](#jwt-authentication)
6. [Quiz Generation Workflow](#quiz-generation-workflow)
7. [REST API Endpoints](#rest-api-endpoints)
8. [Error Handling](#error-handling)
9. [Prerequisites](#prerequisites)
10. [Deployment Instructions](#deployment-instructions)
11. [Database & Test Users](#database--test-users)
12. [Technologies Used](#technologies-used)
13. [Useful Commands](#useful-commands)

---

## Project Description
Quizbot is a full-stack educational platform designed to automate the creation of study materials.
- **Frontend**: A reactive React dashboard built with Material UI for seamless user experience.
- **Backend**: A robust NestJS API following architectural best practices.
- **Containerization**: Uses **Docker** and **Docker Compose** to ensure a consistent, isolated environment for the PostgreSQL database.
- **ORM**: Powered by **Prisma**, providing type-safe database access and automated migrations.

---

## System Architecture (DDD)
The project follows the **Domain-Driven Design (DDD)** principles, separating the application into distinct layers:
- **Application Layer**: Controllers and DTOs handling external requests.
- **Domain Layer**: Core business logic and service interfaces.
- **Infrastructure Layer**: Concrete implementations (Prisma repositories, AI services, JWT strategies).

### Communication Flow
```mermaid
sequenceDiagram
    participant User as User (Browser)
    participant FE as React Frontend
    participant BE as NestJS Backend
    participant DB as PostgreSQL (Prisma)
    participant AI as Gemini AI

    User->>FE: Enters topic/Uploads file
    FE->>BE: POST /api/quizzes/generate (JWT Token)
    BE->>BE: Validate JWT & Check Credits
    BE->>AI: Send prompt with content
    AI-->>BE: Return Quiz JSON
    BE->>DB: Save Quiz, Questions, Options
    DB-->>BE: Confirm save
    BE-->>FE: Return Quiz Object
    FE->>User: Displays interactive Quiz
```

---

## Stack Decisions

| Decision | Justification |
| :--- | :--- |
| **NestJS** | Enforces a modular, scalable architecture (DDD friendly). |
| **React + MUI** | Fast development of complex, accessible UIs with high performance. |
| **Prisma** | Type-safety prevents database runtime errors and simplifies relations. |
| **Bcrypt** | Secure password hashing (10 salt rounds). |
| **Google Gemini** | 2.0 Flash model provides high-speed structured JSON output. |

---

## Data Model

### Table: User
| Field | Type | Attributes |
| :--- | :--- | :--- |
| `id` | `Int` | Primary Key, Autoincrement |
| `email` | `String` | Unique |
| `password` | `String` | Hashed (Bcrypt) |
| `createdAt` | `DateTime` | Default: now() |

### Table: Quiz
| Field | Type | Attributes |
| :--- | :--- | :--- |
| `id` | `Int` | Primary Key, Autoincrement |
| `title` | `String` | |
| `description`| `String` | |
| `userId` | `Int` | Foreign Key (User.id) |

### Table: Question
| Field | Type | Attributes |
| :--- | :--- | :--- |
| `id` | `Int` | Primary Key, Autoincrement |
| `text` | `String` | |
| `quizId` | `Int` | Foreign Key (Quiz.id), OnDelete: Cascade |

---

## JWT Authentication

### Token Generation Example
When a user logs in, the server generates a token with the following payload structure:
```json
{
  "sub": 2,
  "email": "testlocal@gmail.com",
  "iat": 1712256000,
  "exp": 1712259600
}
```

---

## Quiz Generation Workflow

| Route | Description | Input | Output |
| :--- | :--- | :--- | :--- |
| `/api/quizzes/generate` | Orchestrates AI call and persistence. | `topic` (string), `questionCount` (int) | `Quiz` object with nested questions |

### Logic Steps:
1. Extract content from request (Text or File Content).
2. Format a specific prompt for Gemini to force JSON output.
3. Parse and validate the AI's JSON response.
4. Save the nested structure (Quiz -> Questions -> Options) in a single Prisma transaction.

---

## REST API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | User registration. |
| `/api/auth/login` | `POST` | User login (returns JWT). |
| `/api/quizzes/history` | `GET` | User quiz history. |
| `/api/quizzes/:id` | `GET` | Get single quiz details. |

---

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests.

| Code | Response Message | Explanation |
| :--- | :--- | :--- |
| **400** | `Bad Request` | Validation failed (e.g., missing required fields or invalid data types). |
| **401** | `Unauthorized` | Missing or invalid JWT Bearer token. User must log in again. |
| **403** | `Forbidden` | Insufficient credits to perform quiz generation. |
| **413** | `Payload Too Large` | The uploaded document or text exceeds the server limit (50MB). |
| **429** | `Too Many Requests` | Gemini AI API quota exceeded. Please wait 60 seconds. |
| **500** | `Internal Server Error` | Unexpected server error or failure in AI generation. |

---

## Prerequisites
- **Node.js**: v18+
- **Docker**: For PostgreSQL.
- **Git**: To clone the repository.

---

## Deployment Instructions

### Phase 1: Clone Repository
```bash
git clone https://github.com/Elvie246/Quizbot.git
cd Quizbot
```

### Phase 2: Configuration
```bash
# 1. Backend Configuration
cd quizbot-backend
# Create .env and add:
# DATABASE_URL=postgresql://quizbot_user:quizbot_password@localhost:5432/quizbot_db?schema=public
# JWT_SECRET=your_secret_key
# GEMINI_API_KEY=your_google_api_key

# 2. Frontend Configuration
cd ../quizbot-frontend
# Create .env and add:
# REACT_APP_API_URL=http://localhost:3000/api
```

### Phase 3: Launch Services
```bash
# 1. Database (from root)
docker-compose up -d

# 2. Backend
cd quizbot-backend
npm install
npm run start:dev

# 3. Frontend
cd ../quizbot-frontend
npm install
npm start
```

### Phase 4: Access
```bash
# Open your browser at:
http://localhost:3001
```

---

## Database & Test Users

| Email | Password | Role |
| :--- | :--- | :--- |
| `testlocal@gmail.com` | `testlocal` | Test User |

---

## Technologies Used
- **NestJS** (Backend)
- **React + MUI** (Frontend)
- **Prisma** (ORM)
- **PostgreSQL** (Database)
- **Docker** (Infrastructure)
- **Google Gemini** (AI)

---

## Useful Commands
- `npx prisma studio`: Browse database records via UI.
- `npm run start:dev`: Run backend with hot-reload.
- `docker ps`: List running containers.
