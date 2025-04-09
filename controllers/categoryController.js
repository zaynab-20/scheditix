const categoryModel = require('../models/category');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const category = new categoryModel({ categoryName });
    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json({
      message: 'Successfully retrieved all categories',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Get a single category by ID
exports.getOneCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;  
    const category = await categoryModel.findById(categoryId);  

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Successfully retrieved category',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;  
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await categoryModel.findByIdAndUpdate(
      categoryId, 
      { categoryName },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;  
    const category = await categoryModel.findByIdAndDelete(categoryId);  

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category deleted successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
