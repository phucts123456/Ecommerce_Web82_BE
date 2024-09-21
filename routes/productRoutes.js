const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); // Import productController

// Tạo sản phẩm mới
router.post('/', productController.createProduct);

// Lấy danh sách tất cả sản phẩm
router.get('/', productController.getAllProducts);

// Lấy thông tin sản phẩm theo ID
router.get('/:id', productController.getProductById);

// Cập nhật sản phẩm
router.put('/:id', productController.updateProduct);

// Xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

module.exports = router;
