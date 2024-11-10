const { default: mongoose } = require("mongoose");
const orderItemModel = require("../models/orderItemModel");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel")
const constants = require("../utils/constants");

const createOrder = async (req, res) => {
    const status = req.body.status;
    const userId = req.user.id;
    const totalPrice = req.body.totalPrice;
    const streetAddress = req.body.streetAddress;
    const apartment = req.body.apartment;
    const city = req.body.city;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;
    const companyName =  req.body.companyName;
    const items = req.body.items;
    const newOrder = {
        status: status,
        totalPrice: totalPrice,
        streetAddress: streetAddress,
        apartment: apartment,
        city: city,
        phoneNumber: phoneNumber,
        email: email,
        companyName: companyName,
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
            let productUpdateStock = await productModel.findById(item.productId).exec();
            if(!productUpdateStock) {
              productUpdateStock.quantity = productUpdateStock.quantity - Number.parseInt(item.quantity);
            }
            await productUpdateStock.save();
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

const getAllOrder = async (req, res) => {
  const pageNumber = req.query.pn;
  const searchKey = req.query.sk;
  const limit = req.query.limit;
  const pageSize = limit ? limit : constants.CONST_USER_PER_PAGE; // Bạn cần xác định giá trị cho CONST_USER_PER_PAGE
  const skip = (pageNumber - 1) * pageSize;

  let total = await orderModel.countDocuments(); 
  let totalUsers = await orderModel
    .find()
    .skip(skip)
    .limit(pageSize)
    .populate("userId")
    .exec();

  const totalPage = Math.ceil(total / pageSize); 
  const data = {
    totalItems: total,
    totalPage: totalPage,
    currentPage: pageNumber,
    items: totalUsers,
  };

  res.status(200).send({
    message: "Get order is success",
    data: data,
  });
};


// Lấy chi tiết đơn hàng theo ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    if(mongoose.isValidObjectId(orderId)) {
      const order = await orderModel.findById(orderId).populate("userId").exec();

      const orderItems = await orderItemModel.find({orderId: orderId}).populate("productId").exec();
      if (!order || !orderItems) {
      return res.status(400).json({
        message: "Not found order or order items infor",
      });
    }
    res.status(200).json({
      success: true,
      data:{
        order: order,
        orderItems: orderItems
      },
    });
  } else {
    return res.status(400).json({
      message: "Not found order",
    });
  }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    let newStatus = "";
    switch (status) {
      case constants.CONST_ORDER_STATUS_ORDERED:
        newStatus = constants.CONST_ORDER_STATUS_WATTING_FOR_PAYMENT
        break;
       case constants.CONST_ORDER_STATUS_WATTING_FOR_PAYMENT:
        newStatus = constants.CONST_ORDER_STATUS_ACCEPTED 
        break;
        case constants.CONST_ORDER_STATUS_ACCEPTED:
          newStatus = constants.CONST_ORDER_STATUS_SHIPPING 
          break;
       case constants.CONST_ORDER_STATUS_SHIPPING:
        newStatus = constants.CONST_ORDER_STATUS_SHIPPED
        break; 
      case constants.CONST_ORDER_STATUS_SHIPPED:
        newStatus = constants.CONST_ORDER_STATUS_COMPLETE
        break;
    
      default:
        break;
    }
    if (newStatus !== "") {
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { status: newStatus },
        { new: true } // Trả về document đã cập nhật
      );
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Not found order",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Order status updated",
        order,
      });
    }
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
      message: "Delete",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderHistory = async (req, res) => {
  const pageNumber = req.query.pn;
  const searchKey = req.query.sk;
  const limit = req.query.limit;
  const pageSize = limit ? limit : constants.CONST_ORDER_PER_PAGE; // Bạn cần xác định giá trị cho CONST_USER_PER_PAGE
  const skip = (pageNumber - 1) * pageSize;
  const userId = req.user.id;
  console.log(userId)
  let total = await orderModel.countDocuments(); 
  let totalUsers = await orderModel
    .find({userId:userId})
    .skip(skip)
    .limit(pageSize)
    .populate("userId")
    .exec();

  const totalPage = Math.ceil(total / pageSize); 
  const data = {
    totalItems: total,
    totalPage: totalPage,
    currentPage: pageNumber,
    items: totalUsers,
  };

  res.status(200).send({
    message: "Get order product is success",
    data: data,
  });
};

module.exports = {
  createOrder,
  getAllOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderHistory
};
