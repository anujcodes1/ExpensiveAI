import { GoogleGenAI } from "@google/genai";
import Expense from "../models/Expense.js";
import AIInsight from "../models/AIInsight.js";
import { buildAnalysisPrompt, parseGeminiJSON } from "../utils/geminiPrompt.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const buildExpenseSummary = async (userId) => {
  const expenses = await Expense.find({ userId });
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyExpenses = expenses
    .filter((e) => e.date >= startOfMonth)
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });
  const categoryBreakdown = Object.entries(categoryMap).map(([category, total]) => ({
    category,
    total,
  }));

  const trendMap = {};
  expenses.forEach((e) => {
    const key = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, "0")}`;
    trendMap[key] = (trendMap[key] || 0) + e.amount;
  });
  const monthlyTrend = Object.entries(trendMap)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .slice(-6)
    .map(([month, total]) => ({ month, total }));

  return {
    totalExpenses,
    monthlyExpenses,
    categoryBreakdown,
    monthlyTrend,
    expenseCount: expenses.length,
  };
};

export const analyzeExpenses = async (req, res, next) => {
  try {
    const summary = await buildExpenseSummary(req.user._id);

    if (summary.expenseCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Add some expenses first so the AI has data to analyze",
      });
    }

    const prompt = buildAnalysisPrompt(summary);

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const rawText = result.text;
    const parsed = parseGeminiJSON(rawText);

    const insight = await AIInsight.create({
      userId: req.user._id,
      score: parsed.financialHealthScore,
      summary: parsed.summary,
      recommendations: [...(parsed.recommendations || []), ...(parsed.savingsTips || [])],
      budgetSuggestions: parsed.budgetSuggestions || [],
      generatedAt: new Date(),
    });

    res.status(200).json({ success: true, data: insight });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(502).json({ success: false, message: "AI returned an unexpected format. Please try again." });
    }
    next(err);
  }
};

export const getLatestInsight = async (req, res, next) => {
  try {
    const insight = await AIInsight.findOne({ userId: req.user._id }).sort("-generatedAt");
    if (!insight) {
      return res.status(404).json({ success: false, message: "No insights yet. Run an analysis first." });
    }
    res.status(200).json({ success: true, data: insight });
  } catch (err) {
    next(err);
  }
};