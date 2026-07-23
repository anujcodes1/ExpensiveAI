/**
 * Production-level Gemini prompt for expense analysis.
 * Returns strict JSON only — no markdown fences, no preamble.
 */
export const buildAnalysisPrompt = (expenseSummary) => {
  const { totalExpenses, monthlyExpenses, categoryBreakdown, monthlyTrend, expenseCount } =
    expenseSummary;

  return `You are a certified financial analyst AI embedded in an expense tracking app called ExpenseAI.

Analyze the following user spending data and return your analysis as STRICT JSON ONLY.
Do not include markdown code fences, explanations, or any text outside the JSON object.

USER SPENDING DATA:
- Total lifetime expenses: ${totalExpenses}
- Current month expenses: ${monthlyExpenses}
- Number of transactions: ${expenseCount}
- Category breakdown: ${JSON.stringify(categoryBreakdown)}
- Monthly trend (last months): ${JSON.stringify(monthlyTrend)}

INSTRUCTIONS:
1. Calculate a "financialHealthScore" from 0-100 based on spending consistency, category diversity,
   and trend direction (higher score = healthier spending habits, not necessarily lower spending).
2. Write a 2-3 sentence "summary" in plain, encouraging, non-judgmental language.
3. Provide 3-5 specific, actionable items in "recommendations" (each under 20 words).
4. Provide "budgetSuggestions" as an array of objects with "category" and "suggestedLimit"
   (a reasonable monthly cap per category, based on historical spend, as a number).
5. Provide 2-3 short "savingsTips" (each under 20 words).

Respond with EXACTLY this JSON shape and nothing else:
{
  "financialHealthScore": <number 0-100>,
  "summary": "<string>",
  "recommendations": ["<string>", "..."],
  "budgetSuggestions": [{"category": "<string>", "suggestedLimit": <number>}],
  "savingsTips": ["<string>", "..."]
}`;
};

export const parseGeminiJSON = (rawText) => {
  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");
  return JSON.parse(cleaned);
};
