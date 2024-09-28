const categoryModel = require("../models/categoryModel");

// Tạo mới Category
const createCategory = async (req, res) => {
  const categoryName = req.body.name;
  const isExistCategory = await categoryModel.findOne({name:categoryName}).exec();
  if (!isExistCategory) {
      const newCategory = {
          name: categoryName
      }
      await categoryModel.create(newCategory);
      res.status(201).send({
          message: "Create category success",
          data: newCategory
      });
  } else {
      res.status(400).send({
          message: "Create category fail",
      });
  }   
}

// Lấy danh sách tất cả các Category
const getCategory = async (req, res) => {
  const totalItems = await categoryModel.find().exec();
  res.status(200).send({
      message: 'Get category success',
      data: totalItems
  });
}

// Lấy chi tiết Category theo ID
const getCategoryById = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }
    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật tên Category
const updateCategoryName = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true } // Trả về document đã cập nhật
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tên danh mục đã được cập nhật",
      category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa Category theo ID
const deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }

    res.status(200).json({
      success: true,
      message: "Danh mục đã được xóa thành công",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCategory = async (req, res) => {
  const totalItems = await categoryModel.find().limit().exec();
  res.status(200).send({
      message: 'Get all category success',
      data: totalItems
  });
}

module.exports = {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategoryName,
  deleteCategory,
  getAllCategory
};
