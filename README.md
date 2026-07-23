# 💰 ExpenseAI

An AI-powered expense tracker SaaS. Log expenses, see them visualized, and get a
Gemini-generated financial health score with personalized budget and savings recommendations.

## Features

- 🔐 JWT authentication (signup, login, logout, protected routes)
- 🧾 Full expense CRUD — add, view, edit, delete, with validation and toast feedback
- 🔍 Advanced search & filtering — by title, category, date range, and amount range
- 🏷️ Custom + predefined category management
- 📊 SaaS dashboard — total spend, monthly spend, top category, savings trend, recent transactions
- 📈 Recharts visualizations — category pie chart, category bar chart, monthly trend line
- 🤖 AI Insights — Gemini-powered financial health score, spending summary, budget suggestions, and savings tips
- 👤 Profile management — edit name/avatar, change password
- 💀 Polished loading states — skeleton loaders, spinners, empty states, error pages

## Tech Stack

**Frontend:** React 18, Vite, TailwindCSS, React Router, Axios, Recharts, react-hot-toast
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Morgan
**AI:** Google Gemini API (`gemini-1.5-flash`)
**Testing:** Jest, Supertest, mongodb-memory-server
**Deployment:** Frontend → Vercel · Backend → Render · Database → MongoDB Atlas

## Architecture

```
React (Vite + Tailwind + Recharts)  ⇄  Express API (JWT auth)  ⇄  MongoDB Atlas
                                              ⇓
                                        Gemini API (expense analysis)
```

See [`docs/planning.md`](docs/planning.md) for the full architecture, schema, and API design.

## Project Structure

```
expense-ai/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/          # User, Expense, Category, AIInsight
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/      # auth, error handling
│   │   └── utils/           # JWT, Gemini prompt builder
│   ├── tests/                # Jest + Supertest
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/axios.js
│       ├── context/AuthContext.jsx
│       ├── components/       # Navbar, Footer, modals, charts, loaders
│       └── pages/            # Landing, Login, Signup, Dashboard, Expenses, Categories, AI Insights, Profile
└── docs/
    ├── planning.md
    ├── ai-journal.md
    ├── progress-log.md
    └── reflection.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB instance)
- Gemini API key ([Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Clone & install
```bash
git clone <your-repo-url>
cd expense-ai

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

**backend/.env** (copy from `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

**frontend/.env** (copy from `frontend/.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run locally
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```
Frontend: `http://localhost:5173` · Backend: `http://localhost:5000/api/health`

### 4. Run tests
```bash
cd backend && npm test
```

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/expenses` | List expenses (filter/sort/paginate) |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/categories` | List categories |
| GET | `/api/dashboard/summary` | Dashboard totals |
| GET | `/api/dashboard/charts` | Chart data |
| POST | `/api/ai/analyze` | Run Gemini analysis |
| GET | `/api/ai/insights` | Latest AI insight |
| PUT | `/api/profile` | Update profile |
| PUT | `/api/profile/password` | Change password |

Full list in [`docs/planning.md`](docs/planning.md#6-api-list).

## Deployment

- **Frontend (Vercel):** import the `frontend/` directory as the project root, set
  `VITE_API_BASE_URL` to your deployed backend URL. `vercel.json` handles SPA routing.
- **Backend (Render):** `render.yaml` defines the web service. Set `MONGODB_URI`, `JWT_SECRET`,
  `GEMINI_API_KEY`, and `CLIENT_URL` (your deployed Vercel URL) as environment variables in the
  Render dashboard.
- **Database:** MongoDB Atlas — allowlist Render's outbound IPs (or `0.0.0.0/0` for simplicity).

## Documentation

- [Planning](docs/planning.md) — problem statement, architecture, schema, API, roadmap
- [AI Journal](docs/ai-journal.md) — prompts used, AI output, manual fixes
- [Progress Log](docs/progress-log.md) — day-by-day build log
- [Reflection](docs/reflection.md) — challenges, learnings, AI impact

## Author

Built by Anuj Mishra.
