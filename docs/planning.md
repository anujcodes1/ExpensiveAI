# ExpenseAI — Project Planning

## 1. Problem Statement
Most people track expenses reactively (or not at all) using spreadsheets, notes apps, or bank
statements that don't offer insight. They don't know **where their money leaks**, **whether
they're on track for savings goals**, or **what to change** without manually crunching numbers.

ExpenseAI is a SaaS expense tracker that combines simple, fast expense logging with AI-powered
analysis (via the Gemini API) to give users an automatic financial health score, spending
patterns, and actionable budget/savings recommendations — without needing a financial background.

## 2. Target Users
- **Individuals / students** who want a lightweight way to log daily spending.
- **Working professionals** who want monthly trend visibility and savings nudges.
- **Freelancers / small earners** with variable income who need category-level discipline.
- **Budget-conscious households** wanting a shared understanding of spend categories.

## 3. Features

### Core (MVP)
- Auth: signup, login, logout, JWT-protected routes
- Add / edit / delete expenses (title, amount, category, payment method, date, notes)
- Expense listing: table view, pagination, sorting, search/filter (category, date range, amount, title)
- Category management (predefined + custom, per-user)
- Dashboard: total expenses, monthly expenses, top category, recent transactions, savings indicator
- Charts: category pie chart, category bar chart, monthly trend line chart (Recharts)
- Profile management: update name/avatar, change password

### AI Layer (Gemini API)
- Financial health score (0–100) based on spending patterns
- Spending analysis summary (natural language)
- Budget suggestions per category
- Savings recommendations
- AI Insights page rendering the above as cards

### UX
- Skeleton loaders, spinners
- Empty states (no expenses yet, no search results)
- Error pages / toast notifications for all mutations

## 4. Technical Architecture

```
┌─────────────────────┐         ┌──────────────────────┐        ┌─────────────────┐
│   React (Vite)       │  REST   │  Express.js API       │  ODM   │   MongoDB         │
│   + TailwindCSS       │◄──────►│  (Node.js)             │◄──────►│   (Mongoose)      │
│   + Recharts          │  JSON   │  JWT Auth Middleware   │        │                   │
└─────────────────────┘         │  Gemini API integration│        └─────────────────┘
                                  └──────────────────────┘
                                            │
                                            ▼
                                   ┌──────────────────┐
                                   │  Google Gemini API │
                                   │  (expense analysis) │
                                   └──────────────────┘
```

**Frontend:** React 18 + Vite, TailwindCSS, React Router, Axios, Recharts, React Hot Toast (or similar)
**Backend:** Node.js + Express, Mongoose, JWT + bcrypt, Morgan (logging), dotenv, centralized error middleware
**Database:** MongoDB Atlas (cloud) for both dev and prod
**AI:** Gemini API (server-side calls only — API key never exposed to client)
**Deployment:** Frontend → Vercel, Backend → Render

## 5. MongoDB Collections

### `users`
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique, lowercase |
| password | String | required, bcrypt-hashed |
| avatar | String | URL, optional |
| createdAt / updatedAt | Date | timestamps |

### `expenses`
| Field | Type | Notes |
|---|---|---|
| userId | ObjectId (ref: User) | required, indexed |
| title | String | required |
| amount | Number | required |
| category | String | required |
| paymentMethod | String | enum: cash, card, upi, netbanking, other |
| date | Date | required |
| notes | String | optional |
| createdAt / updatedAt | Date | timestamps |

### `categories`
| Field | Type | Notes |
|---|---|---|
| userId | ObjectId (ref: User) | null for predefined/global categories |
| name | String | required |
| icon | String | optional (emoji or icon key) |
| isPredefined | Boolean | default false |

### `aiinsights` (cache of AI results, optional but recommended)
| Field | Type | Notes |
|---|---|---|
| userId | ObjectId (ref: User) | required |
| score | Number | 0–100 |
| summary | String | |
| recommendations | [String] | |
| generatedAt | Date | for cache invalidation (e.g. regenerate weekly) |

## 6. API List

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET  /api/auth/me` (protected)

### Expenses
- `GET    /api/expenses` (query: page, limit, sort, category, dateFrom, dateTo, minAmount, maxAmount, search)
- `POST   /api/expenses`
- `GET    /api/expenses/:id`
- `PUT    /api/expenses/:id`
- `DELETE /api/expenses/:id`

### Categories
- `GET    /api/categories`
- `POST   /api/categories`
- `DELETE /api/categories/:id`

### Dashboard
- `GET /api/dashboard/summary` (totals, monthly, top category, savings indicator)
- `GET /api/dashboard/charts` (pie/bar/trend data)

### AI
- `POST /api/ai/analyze` (triggers Gemini call, returns/stores insight)
- `GET  /api/ai/insights` (latest cached insight)

### Profile
- `PUT /api/profile` (name, avatar)
- `PUT /api/profile/password`

### System
- `GET /api/health`

## 7. Development Milestones
1. Planning + repo scaffold (Steps 1–5)
2. Auth + User schema (Steps 6–7)
3. Expense CRUD (Steps 8–12)
4. Categories + Dashboard + Charts (Steps 13–15)
5. Search (Step 16)
6. AI integration + prompt engineering + Insights UI (Steps 17–19)
7. Profile + polish (loading/error/empty states) (Steps 20–21)
8. Testing (Step 22)
9. Deployment (Step 23)
10. Docs (AI journal, progress log, reflection, README) (Steps 24–27)
11. Final submission (Step 28)

## 8. Deployment Strategy
- **Frontend:** Vercel, auto-deploy from `main` branch, env var `VITE_API_BASE_URL` pointing to Render backend.
- **Backend:** Render web service, env vars for `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `CLIENT_URL` (for CORS).
- **Database:** MongoDB Atlas free tier, IP allowlist set to allow Render's outbound IPs (or 0.0.0.0/0 for simplicity during dev).
- CORS locked to the deployed frontend origin in production.

## 9. Future Scope
- Recurring expenses / subscriptions tracking
- Multi-currency support
- Shared/household budgets with multiple users per workspace
- Receipt image upload + OCR-based auto-fill (Gemini Vision)
- Export to CSV/PDF
- Push/email notifications for budget overruns
- Mobile app (React Native)
