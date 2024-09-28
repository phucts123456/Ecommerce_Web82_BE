const orderItemModel = require("../models/orderItemModel");
const orderModel = require("../models/orderModel");

const createOrder = async (req, res) => {
    const status = req.body.status;
    const userId = req.user.id;
    const totalPrice = req.body.totalPrice;
    const streetAddress = req.body.streetAddress;
    const apartment = req.body.apartment;
    const city = req.body.city;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;
    const items = req.body.items;
    console.log(items)
    const newOrder = {
        status: status,
        totalPrice: totalPrice,
        streetAddress: streetAddress,
        apartment: apartment,
        city: city,
        phoneNumber: phoneNumber,
        email: email,
        orderDate: (new Date()).toDateString(),
        userId: userId
    }
    orderModel.create(newOrder).then( async (newOrder) => {
        for(let item of items) {
            const newOrderItem = {
                productId: item.productId,
                price: item.price,
                orderId: newOrder._id,
                quantity: item.quantity,
                subTotal: item.quantity * item.price
            }
            await orderItemModel.create(newOrderItem);
        }
        newOrder.items = items;
        res.status(201).send({
            message: "Create  order success",
            data: newOrder
        });
    }).catch((error) =>{
        res.status(400).send({
            message: "Create  order fail",
            data: error
        });
    });;
}

// Lấy danh sách tất cả các đơn hàng
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết đơn hàng theo ID
const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Trả về document đã cập nhật
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trạng thái đơn hàng đã được cập nhật",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa đơn hàng theo ID
const deleteOrder = async (req, res) => {
  try {
    const order = await orderModel.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đơn hàng đã được xóa thành công",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
