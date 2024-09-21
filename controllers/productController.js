const Product = require("../models/Product"); // Import model sản phẩm

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const { name, price, isAvailable, quantity, description, categoryid } =
      req.body;

    // Kiểm tra nếu thiếu thông tin cần thiết
    if (!name || !price || !quantity || !description || !categoryid) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin sản phẩm!" });
    }

    const newProduct = new Product({
      name,
      price,
      isAvailable,
      quantity,
      description,
      categoryid,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi server khi tạo sản phẩm mới.",
        error: error.message,
      });
  }
};

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi server khi lấy danh sách sản phẩm.",
        error: error.message,
      });
  }
};

// Lấy thông tin sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi server khi lấy thông tin sản phẩm.",
        error: error.message,
      });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { name, price, isAvailable, quantity, description, categoryid } =
      req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, isAvailable, quantity, description, categoryid },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi server khi cập nhật sản phẩm.",
        error: error.message,
      });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    res.status(200).json({ message: "Đã xóa sản phẩm thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi xóa sản phẩm.", error: error.message });
  }
};

// Xuất các hàm xử lý để sử dụng trong router
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
