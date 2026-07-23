# TDD-Kata-Car-Dealership-Inventory-System-# 

A full-stack, enterprise-grade Car Dealership Inventory Management System built following **Test-Driven Development (TDD)** principles. It features a high-performance **FastAPI** backend integrated with **SQLAlchemy (Async)** and **PostgreSQL**, alongside a modern **React (Vite)** single-page application enhanced with **Optimistic UI Updates** and **Tailwind CSS**.

---

## 📋 Table of Contents

* [🏗️ Architecture & System Overview](#%EF%B8%8F-architecture--system-overview)
* [📸 Application Screenshots & Workflows](#-application-screenshots--workflows)
  * [🚘 Public Views](#-public-views)
  * [👤 Customer Experience](#-customer-experience)
  * [👑 Admin Capabilities](#-admin-capabilities)
  * [⚙️ Automated CI Workflows](#%EF%B8%8F-automated-ci-workflows)
* [🛠️ Tech Stack & Tools](#%EF%B8%8F-tech-stack--tools)
* [📁 Repository Directory Structure](#-repository-directory-structure)
* [⚡ Key Architectural Features & Patterns](#-key-architectural-features--patterns)
* [📡 Backend API Endpoints & Specifications](#-backend-api-endpoints--specifications)
* [🤖 My AI Usage](#-my-ai-usage)
* [🐳 Dockerization Details](#-dockerization-details)
* [🔄 CI Workflow Implementation (GitHub Actions)](#-ci-workflow-implementation-github-actions)
* [🚀 Setup & Local Installation Guide](#-setup--local-installation-guide)
* [🧪 Test Execution & TDD Coverage](#-test-execution--tdd-coverage)

--- 

## 🏗️ Architecture & System Overview

The system is designed with a decoupled, layer-based architecture separating domain models, API routing, business logic, and presentation layers.

```text
┌───────────────────────────────────────────────┐
│          React Frontend SPA (Vite)            │
│   (Optimistic Updates, Modern Components)     │
└───────────────────────┬───────────────────────┘
                        │
              HTTP / REST API (JSON)
                        │
┌───────────────────────▼───────────────────────┐
│             FastAPI Backend                   │
│  ┌─────────────────────────────────────────┐  │
│  │ API Endpoints (Auth / Vehicle / Inventory)│ │
│  └────────────────────┬────────────────────┘  │
│                       │                       │
│  ┌────────────────────▼────────────────────┐  │
│  │ Custom Rate Limiter / Security Guard    │  │
│  └────────────────────┬────────────────────┘  │
│                       │                       │
│  ┌────────────────────▼────────────────────┐  │
│  │  SQLAlchemy Async Session & Pydantic    │  │
│  └────────────────────┬────────────────────┘  │
└───────────────────────┼───────────────────────┘
                        │
      Async Database Connection (asyncpg)
                        │
┌───────────────────────▼───────────────────────┐
│          PostgreSQL Database                  │
│  (Local Docker / Supabase Cloud PgBouncer)    │
└───────────────────────────────────────────────┘
```

---

## 📸 Application Screenshots & Workflows

Here is a visual walk-through of the Car Dealership Inventory System across public, customer, admin, and CI/CD workflows:

### 🚘 Public Views

#### 1. Main Inventory Catalog & Vehicle Search
Browse vehicles, search across brands/models/categories, or filter by price ranges.


#### 2. User Authentication
Clean login portal for customers and admins to sign in and unlock interactive permissions.

<img width="1601" height="807" alt="image" src="https://github.com/user-attachments/assets/005561ed-c84e-4d37-92b4-85a21f9f5776" />


---

### 👤 Customer Experience

#### 3. Logged-in Customer View & Purchase Action
Authenticated customers can purchase available vehicles with real-time stock updates.

<img width="1579" height="932" alt="image" src="https://github.com/user-attachments/assets/d3cc8de6-e73d-4b31-be71-6883801afdaf" />

---

### 👑 Admin Capabilities

#### 4. Admin Panel & Inventory Control
Admins get full stock analytics, total inventory valuation, and tools to update, restock, or delete vehicles.

<img width="1639" height="774" alt="image" src="https://github.com/user-attachments/assets/0fbfbd18-7b1d-4f59-9c2e-bec3ad1b93b2" />


#### 5. Add New Vehicle Modal
Modal form for adding new vehicle inventory with strict validation on stock and pricing.

<img width="1105" height="784" alt="image" src="https://github.com/user-attachments/assets/c428c161-7379-4689-b51b-e590c671db56" />


#### 6. User Profile Information
Overview of authenticated user details, session state, role status, and JWT token metadata.

<img width="1593" height="565" alt="image" src="https://github.com/user-attachments/assets/d7de38a1-140e-468c-8c45-d266077d0004" />


---

### ⚙️ Automated CI Workflows

#### 7. GitHub Actions CI Pipeline
Automated TDD test suites, code verification, and deployment build pipelines running on every commit to `main`.

<img width="1876" height="659" alt="image" src="https://github.com/user-attachments/assets/fd953dd7-8e52-4bf7-b87f-9b21620121a6" />
<img width="1246" height="593" alt="image" src="https://github.com/user-attachments/assets/c21eb161-4b7b-4c8e-8c00-f2445c196b47" />


---

## 🛠️ Tech Stack & Tools

### **Backend**
* **Framework:** Python 3.12 + FastAPI (ASGI framework)
* **Database Driver & ORM:** SQLAlchemy 2.0 (Async Engine) + `asyncpg`
* **Authentication:** JWT (JSON Web Tokens) with `python-jose` & `passlib` (Bcrypt password hashing)
* **Testing Suite:** `pytest`, `pytest-asyncio`, `httpx` (Async API client testing)
* **Database Migration & Pooling:** PostgreSQL (Local Docker) / Supabase (Cloud PgBouncer Port 6543)

### **Frontend**
* **Core:** React 18 + Vite
* **Routing:** React Router v6
* **Styling:** Tailwind CSS + Custom Animations & Glassmorphism design
* **State & Network:** Optimistic UI state updates with Native Async Fetch API abstractions

### **DevOps & Deployment**
* **Containerization:** Docker & Docker Compose (`compose.yaml`)
* **Hosting / Deployment:** Vercel (Serverless Function Deployment)

---

## 📁 Repository Directory Structure

```text
├── .github/                      # CI/CD Workflows
├── backend/                      # Python FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/               # Versioned REST Controllers
│   │   │       ├── auth.py       # Authentication routes (/login, /register)
│   │   │       ├── inventory.py  # Stock management routes (/purchase, /restock)
│   │   │       └── vehicles.py   # Inventory CRUD & Search routes
│   │   ├── core/                 # App Security, Rate Limiter & Config
│   │   │   ├── config.py         # Pydantic BaseSettings environment validation
│   │   │   ├── rate_limiter.py   # Memory-sliding rate limiter middleware
│   │   │   └── security.py       # JWT creation, decoding & bcrypt hashing
│   │   ├── db/                   # Async DB Configuration
│   │   │   ├── base.py           # Base ORM declarative model class
│   │   │   └── session.py        # Async engine & sessionmaker generator
│   │   ├── models/               # SQLAlchemy Database Models
│   │   │   ├── user.py           # User entity (roles: customer/admin)
│   │   │   └── vehicle.py        # Vehicle entity
│   │   ├── schemas/              # Pydantic Request/Response Schemas
│   │   │   ├── auth.py           # Auth payload validation schemas
│   │   │   └── vehicle.py        # Vehicle validation schemas
│   │   ├── services/             # Business Logic Layer
│   │   └── main.py               # FastAPI App entrypoint & CORS definition
│   ├── tests/                    # Pytest Async Test Suite
│   │   ├── conftest.py           # Async SQLite/Postgres Test Fixtures
│   │   ├── test_auth.py          # Auth endpoints TDD tests
│   │   └── test_vehicles.py      # Inventory & Vehicle TDD tests
│   ├── compose.yaml              # Local PostgreSQL DB service
│   ├── Dockerfile                # Backend Production Container setup
│   └── requirements.txt          # Python dependencies
├── frontend/                     # React Single Page Application
│   ├── src/
│   │   ├── components/           # Reusable Atomic UI Components
│   │   │   ├── AuthCard.jsx      # Authentication Container Layout
│   │   │   ├── Input.jsx         # Form Input abstraction
│   │   │   ├── Notice.jsx        # Success & Error Notification Banner
│   │   │   ├── Shell.jsx         # Navigation bar & global frame
│   │   │   ├── Stat.jsx          # Dashboard KPI indicator cards
│   │   │   └── VehicleCard.jsx   # Vehicle display & instant purchase card
│   │   ├── lib/
│   │   │   └── api.js            # API request wrapper & JWT payload helper
│   │   ├── pages/                # Page Components
│   │   │   ├── AdminPage.jsx     # Admin Inventory management table & modal
│   │   │   ├── CatalogPage.jsx   # Customer vehicle store front & search
│   │   │   ├── LoginPage.jsx     # Login form page
│   │   │   ├── ProfilePage.jsx   # User details & active session countdown
│   │   │   └── RegisterPage.jsx  # Customer registration page
│   │   ├── App.jsx               # Root Route Guard & React Router config
│   │   └── main.jsx              # DOM Mounting point
│   ├── compose.yaml              # Local Frontend Docker setup
│   └── vite.config.js            # Vite build configuration
├── PROMPTS.md                    # Complete AI Chat History & Prompts
├── README.md                     # Comprehensive Project Documentation
└── vercel.json                   # Vercel Serverless Function Config
```
---

## ⚡ Key Architectural Features & Patterns

### 1. Test-Driven Development (TDD)
The backend was developed using strict **Red-Green-Refactor** methodology:

* **Red:** Unit/Integration tests were written inside `backend/tests/` to fail first.
* **Green:** Minimum operational code was introduced in models, schemas, and routes until tests passed.
* **Refactor:** Code structure was cleaned, modularized into schemas/services, and optimized for asynchronous DB calls.

### 2. Optimistic UI Updates (Frontend)
To maximize application speed and eliminate user interaction lag:

* Actions like **Purchasing**, **Deleting**, **Editing**, or **Restocking** modify React local state immediately.
* Requests execute in the background via async API calls.
* If a network or backend failure occurs, state is automatically rolled back to its previous snapshot and an error notification is displayed.

### 3. API Throttling & Rate Limiting (SlowAPI)
To shield backend API endpoints from DDoS, brute-force attacks, and abusive traffic:

* Integrated **SlowAPI** using `get_remote_address` to track and limit inbound requests by IP address.
* Decorates high-risk routes like `/api/auth/login` and `/api/auth/register` to enforce granular request thresholds.

### 4. Database Resilience (Local vs. Cloud PgBouncer)
* **Local:** Connects to standard PostgreSQL instances running in Docker containers.
* **Cloud (Supabase):** Integrated with Supabase's transaction pooler (port 6543) using `asyncpg`. Configured with `prepared_statement_cache_size=0` to ensure stability over transaction-pooled connections.

---

## 📡 Backend API Endpoints & Specifications

### 🔑 Authentication

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |

---

### 🚗 Vehicle Management

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/vehicles` | Public / User | Fetch all available vehicles |
| `GET` | `/api/vehicles/search` | Public / User | Filter vehicles by make, model, category, min/max price |
| `POST` | `/api/vehicles` | Admin | Add a new vehicle to inventory |
| `PUT` | `/api/vehicles/:id` | Admin | Update details of an existing vehicle |
| `DELETE` | `/api/vehicles/:id` | Admin | Remove a vehicle from inventory |

---

### 📦 Inventory Actions

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/vehicles/:id/purchase` | Authenticated | Decrement stock by 1 upon customer purchase |
| `POST` | `/api/vehicles/:id/restock` | Admin | Increment stock by specified query parameter quantity |

---

## 🤖 My AI Usage

### 1. AI Tools Used
* **Gemini (`gemini@users.noreply.github.com`):** User schema optimization, API versioning & route structuring, resolving repository case-sensitivity/module errors for CI deployment, and final UI optimization for consistency & smooth UX.
* **GitHub Copilot (`githubcopilot@users.noreply.github.com`):** Designing, building, and testing core backend routes (User Auth, Vehicle CRUD, Search, Purchase, Restock), string case sensitivity handling, query parameter parsing, and writing automated TDD test suites (`pytest`).
* **Antigravity (`antigravity@users.noreply.github.com`):** UI boilerplate generation, user-friendly layout improvements, documentation, code comment generation, and frontend import error resolution.

---

### 2. How They Were Used
* **Authentication & User Management:** Leveraged **Gemini** for user schema optimization, API versioning, and route structuring. Used **GitHub Copilot** to handle token case sensitivity during login testing.
* **Vehicle CRUD & Search:** Co-authored with **GitHub Copilot** to build and test core API routes including vehicle retrieval, addition/deletion/update schemas, and search query parameter logic.
* **Inventory Stock Management:** Partnered with **GitHub Copilot** for purchase quantity decrement logic and restocking endpoint implementation alongside corresponding `pytest` cases.
* **TDD & Test Optimization:** Co-authored failing/passing unit test cases for duplicate user registration handling and overall test optimization with **GitHub Copilot**.
* **Frontend Development & UI Polish:** Worked with **Antigravity** for UI layout optimization, adding frontend documentation, code comments, and resolving module import errors.
* **CI/CD & Deployment Fixes:** Partnered with **Gemini** to resolve repository case-sensitivity issues blocking GitHub Actions workflows and to make final project optimizations prior to Vercel deployment.

---

## 🐳 Dockerization Details

Both the backend and frontend are fully containerized using Docker and Docker Compose, allowing the entire application stack to be booted with a single command without installing local dependencies.

### 1. Backend Docker Architecture (`/backend/Dockerfile`)
* **Base Image:** `python:3.12-slim` for minimal image size and attack surface.
* **Optimization:** Utilizes Docker layer caching for `requirements.txt` to minimize build times.
* **Healthcheck:** Evaluates DB readiness prior to accepting incoming ASGI traffic via Uvicorn.

### 2. Frontend Docker Architecture (`/frontend/Dockerfile`)
* **Multi-Stage Build:**
  * **Stage 1 (Builder):** Uses `node:20-alpine` to install packages and compile production Vite assets (`dist`).
  * **Stage 2 (Serving):** Uses `nginx:alpine` to serve static assets efficiently with low memory overhead.

### 3. Running the Entire Application with Docker Compose
To spin up the PostgreSQL database, FastAPI backend, and React frontend simultaneously:

```bash
# Run from root directory or run docker-compose in respective directories
docker compose -f backend/compose.yaml -f frontend/compose.yaml up --build -d
```

* **Frontend:** `http://localhost:5173` or `http://localhost:80`
* **Backend API Docs:** `http://localhost:8000/docs`
* **PostgreSQL:** `localhost:5432`

---

## 🔄 CI Workflow Implementation (GitHub Actions)

Continuous Integration is powered by GitHub Actions (`.github/workflows/ci.yml`) to enforce code quality, run automated tests, and ensure TDD integrity on every `push` or `pull_request` targeting the `main` branch.

### Pipeline Stages & Jobs

```text
┌─────────────────────────────────────────────────────────────┐
│                 GitHub Actions CI Trigger                   │
│                (Push / Pull Request to main)                │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
  ┌───────────────────────────┐   ┌───────────────────────────┐
  │      Backend CI Job       │   │      Frontend CI Job      │
  ├───────────────────────────┤   ├───────────────────────────┤
  │ 1. Setup Python 3.12      │   │ 1. Setup Node.js 20       │
  │ 2. Install Dependencies   │   │ 2. Install Dependencies   │
  │ 3. Run Flake8 / Ruff Lint │   │ 3. Run ESLint / Prettier  │
  │ 4. Run Pytest Suite       │   │ 4. Execute Vite Build     │
  └───────────────────────────┘   └───────────────────────────┘
```

### GitHub Actions Workflow Summary (`ci.yml`)
* **Automated TDD Verification:** Executes all 14+ `pytest` unit/integration tests on isolated runner environments.
* **Quality Gates:** Fails the build automatically if any unit tests fail, ensuring unvalidated code never merges to `main`.
* **Build Verification:** Executes `npm run build` to verify frontend TypeScript/JSX compilation and asset bundling before deployment.

---

## 🚀 Setup & Local Installation Guide

### 🌐 Live Deployment
* **Production App:** [https://tdd-car-dealership-inventory.vercel.app](https://tdd-car-dealership-inventory.vercel.app)

### Prerequisites
* **Python:** 3.12+
* **Node.js:** v18+ or v20+
* **Docker & Docker Compose:** Optional, for quick database startup

---

### Step 1: Clone Repository

```bash
git clone https://github.com/rushi78441/TDD-Kata-Car-Dealership-Inventory-System-.git
cd car-dealership-inventory
```

---

### Step 2: Start PostgreSQL Database (Docker)

Run local PostgreSQL using Docker Compose:

```bash
cd backend
docker compose up -d db
```

---

### Step 3: Backend Setup & TDD Execution

Navigate to the backend directory and create a virtual environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Set environment variables (Create `.env` inside `/backend`):

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/dealership
SECRET_KEY=supersecretjwtkey_change_me_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Run Pytest Test Suite (TDD Verification):

```bash
pytest -v
```

Start backend development server:

```bash
uvicorn app.main:app --reload --port 8000
```

> 💡 The interactive Swagger documentation will be available at `http://localhost:8000/docs`.

---

### Step 4: Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Set Environment Variables (Create `.env` inside `/frontend`):

```env
VITE_API_BASE_URL=http://localhost:8000
```

Run Development Server:

```bash
npm run dev
```

> 💡 Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Test Execution & TDD Coverage

Run all backend unit and integration tests using `pytest`:

```bash
cd backend
pytest --cov=app tests/
```

### Expected Output

```text
============================== test session starts ==============================
platform linux -- Python 3.12.x, pytest-8.x.x
rootdir: /path/to/backend
plugins: asyncio-0.23.x, cov-5.x.x
collected 14 items                                                              

tests/test_auth.py ...........                                             [ 78%]
tests/test_vehicles.py .....                                              [100%]

============================== 14 passed in 1.42s ===============================
```
