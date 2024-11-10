const Inventory = require("../models/Inventory");

// Tạo mới Inventory
const createInventory = async (req, res) => {
  try {
    const { productid, orderid, quantity } = req.body;
    const newInventory = new Inventory({
      productid,
      orderid,
      quantity,
    });
    await newInventory.save();
    res.status(201).json({
      success: true,
      message: "Kho hàng đã được tạo thành công",
      inventory: newInventory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách Inventory
const getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find();
    res.status(200).json({
      success: true,
      inventories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết Inventory theo ID
const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy kho hàng",
      });
    }
    res.status(200).json({
      success: true,
      inventory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật số lượng Inventory
const updateInventoryQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true } // Trả về document đã cập nhật
    );

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy kho hàng",
      });
    }

    res.status(200).json({
      success: true,
      message: "Số lượng kho hàng đã được cập nhật",
      inventory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa Inventory theo ID
const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy kho hàng",
      });
    }

    res.status(200).json({
      success: true,
      message: "Kho hàng đã được xóa thành công",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInventory,
  getAllInventories,
  getInventoryById,
  updateInventoryQuantity,
  deleteInventory,
};
