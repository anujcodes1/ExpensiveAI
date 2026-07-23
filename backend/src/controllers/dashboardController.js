import Expense from "../models/Expense.js";

export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [totalAgg, monthAgg, lastMonthAgg, topCategoryAgg, recentTransactions] = await Promise.all([
      Expense.aggregate([{ $match: { userId } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.aggregate([
        { $match: { userId, date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: { userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: { userId, date: { $gte: startOfMonth } } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } },
        { $limit: 1 },
      ]),
      Expense.find({ userId }).sort("-date").limit(5),
    ]);

    const totalExpenses = totalAgg[0]?.total || 0;
    const monthlyExpenses = monthAgg[0]?.total || 0;
    const lastMonthExpenses = lastMonthAgg[0]?.total || 0;
    const topCategory = topCategoryAgg[0]?._id || null;

    let savingsIndicator = "neutral";
    if (lastMonthExpenses > 0) {
      const change = ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
      savingsIndicator = change < 0 ? "improving" : change > 0 ? "declining" : "neutral";
    }

    res.status(200).json({
      success: true,
      data: {
        totalExpenses,
        monthlyExpenses,
        lastMonthExpenses,
        topCategory,
        savingsIndicator,
        recentTransactions,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getChartData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const categoryBreakdown = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);

    const monthlyTrend = await Expense.aggregate([
      { $match: { userId, date: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        pie: categoryBreakdown.map((c) => ({ name: c._id, value: c.total })),
        bar: categoryBreakdown.map((c) => ({ category: c._id, amount: c.total })),
        trend: monthlyTrend.map((m) => ({
          month: `${m._id.year}-${String(m._id.month).padStart(2, "0")}`,
          amount: m.total,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};
