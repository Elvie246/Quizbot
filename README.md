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
9. [Release History & Roadmap](#release-history--roadmap)
10. [Prerequisites](#prerequisites)
11. [Deployment Instructions](#deployment-instructions)
12. [Database & Test Users](#database--test-users)
13. [Technologies Used](#technologies-used)
14. [Useful Commands](#useful-commands)

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

---

## REST API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | User registration. |
| `/api/auth/login` | `POST` | User login (returns JWT). |
| `/api/quizzes/generate-public` | `POST` | Public AI generation (Guest mode). |
| `/api/quizzes/history` | `GET` | User quiz history. |

---

## Error Handling

| Code | Response Message | Explanation |
| :--- | :--- | :--- |
| **401** | `Unauthorized` | Missing or invalid JWT token. |
| **413** | `Payload Too Large` | Document exceeds 50MB. |
| **429** | `Too Many Requests` | Gemini quota exceeded. |

---

## Release History & Roadmap

### Release 1.0.0 (Current)
- **Core Engine**: AI quiz generation using Google Gemini 2.0 Flash.
- **Authentication**: Secure JWT-based login/register system.
- **DDD Architecture**: Scalable backend following Domain-Driven Design.
- **Guest Mode**: Allows non-registered users to test the app (limit: 2 quizzes).
- **File Support**: Document upload (txt, md) with 50MB server limit.
- **Interactive UI**: Dark/Light mode, multi-language (EN/FR), and quiz player.
- **Legal Pages**: Privacy Policy, Cookies Policy, and Contact Us integration.

### Release 2.0.0 (Planned Roadmap)
- **Premium AI Integration**: Support for OpenAI (GPT-4o) or Anthropic (Claude 3.5) for superior quiz quality.
- **Advanced File Parsing**: Native support for PDF and DOCX deep analysis.
- **User Dashboard**: Detailed statistics on quiz performance and learning progress.
- **Pro Credits System**: Integration of a real payment gateway (Stripe) for unlimited generations.

---

## Prerequisites
- **Node.js**: v18+
- **Docker**: For PostgreSQL.

---

## Deployment Instructions

### Phase 1: Clone Repository
```bash
git clone https://github.com/Elvie246/Quizbot.git
cd Quizbot
```

### Phase 2: Configuration
```bash
# Backend .env
DATABASE_URL=postgresql://quizbot_user:quizbot_password@localhost:5432/quizbot_db?schema=public
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key

# Frontend .env
REACT_APP_API_URL=http://localhost:3000/api
```

### Phase 3: Launch Services
```bash
docker-compose up -d
# Then npm install & npm start in both folders
```

### Phase 4: Access
```bash
http://localhost:3001
```

---

## Database & Test Users
| Email | Password | Role |
| :--- | :--- | :--- |
| `testlocal@gmail.com` | `testlocal` | Test User |

---

## Technologies Used
- **NestJS**, **React**, **PostgreSQL**, **Prisma**, **Docker**, **Google Gemini**.

---

## Useful Commands
- `npx prisma studio`: View database.
- `npm run start:dev`: Run backend.
