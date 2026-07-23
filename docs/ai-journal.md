# AI Journal — ExpenseAI

This log documents how AI (Claude, via the prompt playbook) was used to scaffold ExpenseAI,
what it produced, and what needed manual correction.

## Step 1 — Planning
**Prompt used:** "Build docs/planning.md with Problem Statement, Target Users, Features,
Technical Architecture, MongoDB Collections, API List, Development Milestones, Deployment
Strategy, and Future Scope."
**AI output:** Full planning doc covering all requested sections.
**Manual fixes:** None needed — used as the source of truth for every subsequent step.

## Steps 2–5 — Scaffolding
**Prompt used:** Repository structure, Vite/Tailwind config, Express app skeleton, MongoDB
connection with retry logic.
**AI output:** `backend/` and `frontend/` directory trees, `db.js` with exponential-style retry
(5 attempts, 3s delay), Express app wired with CORS, Morgan, dotenv, and a `/api/health` route.
**Manual fixes:** Adjusted CORS origin to read from `CLIENT_URL` env var instead of a hardcoded
localhost value, so it works correctly after deployment.

## Steps 6–7 — User Schema & Auth
**Prompt used:** "Create a User schema with name, email, password, avatar, validation,
timestamps, and password hashing" + "Implement JWT Authentication with Signup, Login, Logout,
Protected Routes, and bcrypt."
**AI output:** Mongoose schema with a `pre('save')` bcrypt hook, `comparePassword` instance
method, and full auth controller/routes with a `protect` middleware reading the `Authorization`
header.
**Manual fixes:** Added `select: false` on the password field so it's never returned by default,
and a `toSafeObject()` helper so raw Mongoose documents are never sent to the client.

## Steps 8–12 — Expense CRUD
**AI output:** Expense schema + full CRUD controller with query-based filtering
(category, date range, amount range, search) baked directly into `getExpenses` rather than
as a separate endpoint.
**Manual fixes:** Added compound indexes (`userId + date`, `userId + category`) for query
performance once pagination was in place.

## Steps 13–16 — Categories, Dashboard, Charts, Search
**AI output:** Category schema with a `isPredefined` flag so seeded categories can't be deleted
by users; dashboard aggregation pipelines for totals, monthly figures, top category, and a
month-over-month "savings indicator"; Recharts pie/bar/line components; search folded into the
existing expense list endpoint via query params instead of a separate `/search` route.
**Manual fixes:** The first aggregation draft compared this month to *all-time* average, which
made the savings indicator noisy. Changed it to compare current month vs. the immediately
preceding month instead.

## Steps 17–19 — AI Integration
**Prompt used:** "Write a production-level Gemini prompt for expense analysis returning JSON
only."
**AI output:** A structured prompt (`geminiPrompt.js`) instructing Gemini to return strict JSON
with `financialHealthScore`, `summary`, `recommendations`, `budgetSuggestions`, and
`savingsTips` — explicitly forbidding markdown fences or extra prose.
**Manual fixes:** Even with the instruction, Gemini occasionally wraps JSON in ` ```json ` fences.
Added a `parseGeminiJSON()` sanitizer that strips fences before `JSON.parse`, and a `try/catch`
that returns a clean 502 error ("AI returned an unexpected format") instead of crashing the
request if parsing still fails.

## Steps 20–21 — Profile & Loading States
**AI output:** Profile update + password change endpoints; skeleton loaders, spinners, and
empty-state components reused across Dashboard, Expenses, Categories, and AI Insights.
**Manual fixes:** None significant — mostly styling tweaks to match the Tailwind theme.

## Step 22 — Testing
**AI output:** Jest + Supertest suite using `mongodb-memory-server` so tests don't touch a real
database. Covers signup/login happy paths + failure cases, and expense CRUD + auth guard.
**Manual fixes:** Had to explicitly set `NODE_ENV=test` and a dummy `JWT_SECRET` before importing
the app in each test file, since env vars weren't loaded yet at import time otherwise.

## Steps 23–27 — Deployment & Docs
**AI output:** `render.yaml` for the backend and `vercel.json` SPA rewrite rule for the frontend;
this journal, the progress log, the reflection doc, and the README.
**Manual fixes:** None — reviewed and committed as generated.

## Overall reflection on AI-assisted development
The AI was strongest at producing consistent, boilerplate-heavy code (schemas, CRUD controllers,
middleware) quickly and correctly on the first pass. The places that needed the most manual
judgment were: (1) tuning the dashboard aggregation logic to be actually useful rather than just
technically correct, and (2) hardening the Gemini integration against non-deterministic output
formatting, since LLM responses can't be trusted to strictly follow a JSON-only instruction
100% of the time.
