# Reflection — ExpenseAI

## Challenges

**Non-deterministic AI output.** The hardest part of this project wasn't the CRUD app — that's
well-trodden ground. It was making the Gemini integration reliable. An LLM asked for "JSON only"
will still occasionally wrap its response in markdown fences or add a stray sentence. The fix
wasn't to trust the prompt harder; it was to treat the AI response as untrusted input and
sanitize/validate it before using it, the same way you'd treat any external API response.

**Meaningful aggregations, not just correct ones.** Early dashboard aggregations were technically
correct but not useful — e.g., comparing this month's spend to an all-time average made the
"savings indicator" swing on almost no signal. Getting a metric that's actually informative took
more iteration than getting the MongoDB aggregation pipeline syntax right.

**Query-param based filtering at scale.** Combining category, date range, amount range, and text
search into a single endpoint (`GET /expenses`) kept the API small, but required care with
compound indexes once pagination and sorting were layered on top, to avoid slow queries as data
grows.

## What AI assistance was good at
- Producing consistent boilerplate (schemas, middleware, CRUD controllers) fast and correctly.
- Generating a reasonable first-pass architecture and API surface from a short prompt.
- Writing test scaffolding (Jest/Supertest setup) that would otherwise eat significant time.

## What still needed a human
- Deciding *which* metrics actually matter for a "financial health" dashboard.
- Hardening against real-world LLM response variance.
- Judgment calls on API shape (e.g., folding search into the list endpoint vs. a separate route).

## Key learnings
1. Treat any AI-generated JSON response as untrusted and parse defensively.
2. A working aggregation pipeline and a *useful* one are not the same thing — always sanity-check
   against realistic data.
3. Documenting AI prompts and their outputs as you go (rather than after the fact) makes it much
   easier to justify design decisions later.
