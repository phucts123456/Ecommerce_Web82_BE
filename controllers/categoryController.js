const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
const constants = require("../utils/constants");
// Tạo mới Category
const createCategory = async (req, res) => {
  const categoryName = req.body.name;
  const categoryId = req.body._id;
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
          message: "Create category fail. Category existed",
      });
  }   
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
    const { _id , name } = req.body;
    const category = await categoryModel.findByIdAndUpdate(
      _id,
      { name },
      { new: true } // Trả về document đã cập nhật
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Not found category",
      });
    }

    res.status(200).json({
      success: true,
      message: "Update category success.",
      category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa Category theo ID
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const isExistProductUse = await productModel.findOne({categoryId:categoryId}).exec();
    if(!isExistProductUse) {
      const category = await categoryModel.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(400).json({
          message: "Not found category",
        });
      }
  
      res.status(200).json({
        message: "Delete category success",
      });
    } else {
      return res.status(400).json({
        message: "Delete fail. This category is used by at least one product.",
      });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

const getAllCategory = async (req, res) => {
  const totalItems = await categoryModel.find().limit().exec();
  res.status(200).send({
      message: 'Get all category success',
      data: totalItems
  });
}

const getCategory = async (req, res) => {
  const pageNumber = Number.parseInt(req.query.pn);
  const searchKey = req.query.sk;
  const limit = req.query.limit;
  const pageSize = limit ? limit : constants.CONST_CATEGORY_PER_PAGE; // Bạn cần xác định giá trị cho CONST_ORDER_PER_PAGE
  const skip = (pageNumber - 1) * pageSize;

  let total = await categoryModel.countDocuments().exec(); 
  let totalCategory = await categoryModel
    .find()
    .skip(skip)
    .limit(pageSize)
    .exec();
  const totalPage = Math.ceil(total / pageSize); 
  const data = {
    totalItems: total,
    totalPage: totalPage,
    currentPage: pageNumber,
    items: totalCategory,
  };

  res.status(200).send({
    message: "Get category success",
    data: data,
  });
};

module.exports = {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategoryName,
  deleteCategory,
  getAllCategory
};
