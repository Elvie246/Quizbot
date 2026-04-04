# Quizbot Technical Documentation

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
8. [Prerequisites](#prerequisites)
9. [Deployment Instructions](#deployment-instructions)
10. [Database & Test Users](#database--test-users)
11. [Technologies Used](#technologies-used)
12. [Useful Commands](#useful-commands)

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

### Authentication Logic
1. **Config**: `JWT_SECRET` and `JWT_EXPIRES_IN` are loaded from `.env`.
2. **Validation**: The `JwtStrategy` verifies the signature and expiration.
3. **Guard**: The `@UseGuards(JwtAuthGuard)` decorator protects routes.
4. **Revocation**: Client-side logout clears the token from `localStorage`.

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
1. **Backend**: 
   - `cd quizbot-backend`
   - Copy `.env.example` to `.env` and fill:
     - `DATABASE_URL=postgresql://quizbot_user:quizbot_password@localhost:5432/quizbot_db?schema=public`
     - `GEMINI_API_KEY=your_google_api_key`
2. **Frontend**: 
   - `cd ../quizbot-frontend`
   - Set `REACT_APP_API_URL=http://localhost:3000/api` in `.env`.

### Phase 3: Launch Services
1. **Database**: `docker-compose up -d` (from root).
2. **Backend**: `npm install && npm run start:dev`.
3. **Frontend**: `npm install && npm start`.

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
