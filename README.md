## Diet Horizon

Diet Horizon is a full‑stack fitness and nutrition web application that helps users track their health journey, buy products, and manage personalised diet and workout plans.

The project is split into:

- **backend** – Node.js/Express REST API with MongoDB (Atlas) and JWT authentication
- **frontend** – React (Create React App) SPA consuming the backend API

---

## Features

- **Authentication & Accounts**
  - User registration and login with JWT
  - Roles: `user`, `trainer`, `admin`
  - Profile management and password change

- **User Experience**
  - Dashboard with quick access to diet plans, workouts, orders, BMI, and AI recipes
  - BMI calculator with modern UI
  - AI recipe generator powered by Spoonacular

- **E‑commerce**
  - Product listing and product details
  - Cart management (add/update/remove/clear)
  - Checkout and order history

- **Trainer & Admin Tools**
  - Trainer dashboard and client management
  - Admin dashboard, users, products, and orders management

---

## Tech Stack

- **Frontend**
  - React (Create React App)
  - React Router
  - Axios
  - React Hook Form & Yup (for forms/validation)

- **Backend**
  - Node.js, Express
  - MongoDB + Mongoose
  - JWT authentication
  - express‑validator
  - dotenv, morgan, cors

---

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- npm
- MongoDB Atlas account (or a local MongoDB instance)

---

## Environment Variables

### Backend – `backend/.env`

Create a `.env` file in `backend` based on `.env.example`:

```env
PORT=3300
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

SPOONACULAR_API_KEY=your_spoonacular_api_key_here
```

Notes:

- For Atlas, use a connection string like:
  `mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority&appName=<appName>`
- Make sure your IP is whitelisted in Atlas.

### Frontend – `frontend/.env`

Create a `.env` file in `frontend` based on `.env.example`:

```env
REACT_APP_API_URL=http://localhost:3300/api
API_BASE_URL=http://localhost:3300/api
SPOONACULAR_API_KEY=your_spoonacular_api_key_here
```

These values are read via `src/config.js` and used by the Axios API client.

---

## Installation & Running

From the project root (`DietHorizon-main/DietHorizon-main`):

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Run the backend

```bash
cd backend
npx nodemon server.js
# or
node server.js
```

The backend will start on `http://localhost:3300` (or the `PORT` you set in `.env`).

### 3. Run the frontend

In a separate terminal:

```bash
cd frontend
npm start
```

The React app will start on `http://localhost:3000` and talk to the backend via the configured API URL.

---

## Manual API Tests (No Jest)

There is a simple manual test runner for the backend in `backend/tests/index.js`.  
It uses Axios to hit key endpoints (auth, products, cart, orders, diet/workout plans, recipes) and logs `[PASS]/[FAIL]` with basic expectations.

**Usage:**

1. Make sure the backend is running.

2. In another terminal:

```bash
cd backend
node tests/index.js
```

You will see output like:

```text
Running N tests against http://localhost:3300/api
[PASS] Auth: register new user { ... }
[PASS] Auth: login as registered user { ... }
...
Finished running tests.
```

---

## Project Structure (High Level)

```text
backend/
  config/           # DB connection
  controllers/      # Route handlers (auth, users, products, cart, orders, diet, workout, trainer, admin)
  models/           # Mongoose models (User, Product, Cart, Order, DietPlan, WorkoutPlan, Category, etc.)
  routes/           # Express routers under /api/*
  middlewares/      # Auth, validation, error handling, async handler
  utils/            # ErrorResponse, JWT helpers, error messages
  validations/      # express-validator rule sets
  tests/            # Manual API tests (index.js)
  server.js         # Express app entry point

frontend/
  src/
    components/     # Navbar, product list, cart, checkout, forms, etc.
    pages/          # Home, Login, Register, Dashboard, BMI, Orders, Profile, Trainer/Admin views
    context/        # User and Cart context providers
    services/       # Axios API client
    config.js       # API URL and client‑side config
    App.js          # Routing setup
    index.css       # Global styles
```

---

## Useful URLs (Development)

- Frontend: `http://localhost:3000`
- Backend base: `http://localhost:3300/api`
- Example routes:
  - Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
  - Products: `/api/products`, `/api/products/featured`
  - Cart: `/api/cart`, `/api/cart/add`
  - Orders: `/api/orders`
  - BMI page (frontend): `/bmi-calculator`
  - AI Recipe Generator (frontend): `/recipe-generator`

---

## Notes & Tips

- After changing `.env` files in the **frontend**, restart `npm start` so Create React App picks up new variables.
- For the **backend**, restarting `nodemon`/`node server.js` is enough to pick up environment changes or code edits.
- Keep your real MongoDB URI and API keys out of version control; only commit the `.env.example` files.
