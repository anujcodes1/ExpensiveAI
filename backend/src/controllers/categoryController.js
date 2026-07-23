import Category from "../models/Category.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({
      $or: [{ userId: req.user._id }, { isPredefined: true }],
    }).sort("name");
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Category name is required" });

    const category = await Category.create({ userId: req.user._id, name, icon });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
      isPredefined: false,
    });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found or not deletable" });
    }
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};
