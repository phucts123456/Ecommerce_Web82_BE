const express = require("express");
const {
  createInventory,
  getAllInventories,
  getInventoryById,
  updateInventoryQuantity,
  deleteInventory,
} = require("../controllers/inventoryController");

const router = express.Router();

// Định tuyến cho các chức năng của Inventory
router.post("/", createInventory); // Tạo Inventory mới
router.get("/", getAllInventories); // Lấy danh sách Inventory
router.get("/:id", getInventoryById); // Lấy chi tiết Inventory theo ID
router.put("/:id", updateInventoryQuantity); // Cập nhật số lượng Inventory theo ID
router.delete("/:id", deleteInventory); // Xóa Inventory theo ID

module.exports = router;
