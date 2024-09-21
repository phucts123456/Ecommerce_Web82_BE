const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

// Định tuyến cho các chức năng của đơn hàng
router.post("/", createOrder); // Tạo đơn hàng mới
router.get("/", getAllOrders); // Lấy danh sách đơn hàng
router.get("/:id", getOrderById); // Lấy chi tiết đơn hàng theo ID
router.put("/:id", updateOrderStatus); // Cập nhật trạng thái đơn hàng theo ID
router.delete("/:id", deleteOrder); // Xóa đơn hàng theo ID

module.exports = router;
