# Progress Log — ExpenseAI

| Day | Steps Covered | What Shipped | Decisions Made |
|---|---|---|---|
| Day 1 | 1–5 | Planning doc, repo scaffold, Vite+Tailwind config, Express app skeleton, MongoDB connection with retry | Chose MongoDB Atlas over local Mongo for consistency between dev and prod. Chose Vite over CRA for faster dev server. |
| Day 2 | 6–7 | User schema, JWT auth (signup/login/logout), protected route middleware | Passwords hashed with bcrypt at the schema level (`pre('save')`) rather than in the controller, so it can't be forgotten in future code paths. |
| Day 3 | 8–12 | Expense schema, full CRUD (add/view/edit/delete) with validation and toast notifications | Filtering/search folded into the main `GET /expenses` endpoint via query params instead of a separate search route, to keep the API surface small. |
| Day 4 | 13–16 | Category management, SaaS dashboard, Recharts (pie/bar/trend), advanced search | Dashboard "savings indicator" defined as month-over-month change rather than vs. all-time average — more actionable for the user. |
| Day 5 | 17–19 | Gemini API integration, prompt engineering for JSON-only output, AI Insights UI | Added a JSON-fence stripping sanitizer since Gemini doesn't always honor "no markdown" instructions. Insights are cached in MongoDB (`aiinsights` collection) rather than recalculated on every page load. |
| Day 6 | 20–21 | Profile management, password change, skeleton loaders, empty states, error pages | Reused a single `Loader`/`EmptyState` component set across all pages instead of writing bespoke ones for consistency. |
| Day 7 | 22–23 | Jest + Supertest test suite, Vercel + Render deployment configs | Used `mongodb-memory-server` for tests so CI doesn't depend on a live Atlas cluster. |
| Day 8 | 24–28 | AI journal, progress log, reflection, README, final submission prep | Wrote docs last so they accurately reflect what was actually built, not what was planned. |

## Notes
- Steps were followed roughly in playbook order, but categories/dashboard/charts (13–15) were
  built together in one sitting since they share the same aggregation logic.
- No step was skipped; where the AI's first draft needed changes, they're recorded in
  `ai-journal.md` rather than duplicated here.
