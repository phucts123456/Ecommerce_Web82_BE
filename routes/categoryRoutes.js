const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryName,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

// Định tuyến cho các chức năng của Category
router.post("/", createCategory); // Tạo Category mới
router.get("/", getAllCategories); // Lấy danh sách Category
router.get("/:id", getCategoryById); // Lấy chi tiết Category theo ID
router.put("/:id", updateCategoryName); // Cập nhật tên Category theo ID
router.delete("/:id", deleteCategory); // Xóa Category theo ID

module.exports = router;
