import Expense from "../models/Expense.js";

export const getExpenses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-date",
      category,
      dateFrom,
      dateTo,
      minAmount,
      maxAmount,
      search,
    } = req.query;

    const filter = { userId: req.user._id };

    if (category) filter.category = category;
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit)));

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Expense.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) return res.status(404).json({ success: false, message: "Expense not found" });
    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, paymentMethod, date, notes } = req.body;

    if (!title || amount === undefined || !category) {
      return res.status(400).json({ success: false, message: "Title, amount, and category are required" });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      title,
      amount,
      category,
      paymentMethod,
      date: date || Date.now(),
      notes,
    });

    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) return res.status(404).json({ success: false, message: "Expense not found" });
    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!expense) return res.status(404).json({ success: false, message: "Expense not found" });
    res.status(200).json({ success: true, message: "Expense deleted" });
  } catch (err) {
    next(err);
  }
};
