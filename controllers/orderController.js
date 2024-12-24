const { default: mongoose } = require("mongoose");
const orderItemModel = require("../models/orderItemModel");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const productStockModel = require("../models/productStock");
const constants = require("../utils/constants");
const ShopModel = require("../models/ShopModel");
const sendMail = require("../utils/sendmail")
const createOrder = async (req, res) => {
    // const status = req.body.status;
    // const userId = req.user.id;
    // const totalPrice = req.body.totalPrice;
    // const subTotal = req.body.subTotal;
    // const shippingFee = req.body.shippingFee;
    // const streetAddress = req.body.streetAddress;
    // const apartment = req.body.apartment;
    // const phoneNumber = req.body.phoneNumber;
    // const email = req.body.email;
    // const provinceId =  req.body.provinceId;
    // const districtId =  req.body.districtId;
    // const wardId =  req.body.wardId;
    // const items = req.body.items;
    const orders = req.body.orders;
    console.log(req.body);
    const responseData = []
    
    for(const order of orders) {
        let html = "";
        const newOrder = {
          status: order.status,
          subTotal: order.subTotal,
          totalPrice: order.totalPrice,
          shippingFee: order.shippingFee,
          streetAddress: order.streetAddress,
          apartment: order.apartment,       
          provinceId: order.provinceId,
          districtId: order.districtId,
          wardId: order.wardId,
          phoneNumber: order.phoneNumber,
          email: order.email,
          orderDate: (new Date()).toDateString(),
          userId: order.userId,
          shopId: order.shopId
        }
        const result = await orderModel.create(newOrder);
        const shop = await ShopModel.findById(order.shopId).exec();
        if (shop) {
          html += `<h2>You have just order (shop: ${shop.name}) - Order ID: ${result._id}</h2><br \>`
        }
        if(result._id) 
        {
          for(let item of order.items) {
            const newOrderItem = {
                productId: item.productId,
                variationId: item.variationId,
                price: item.price,
                orderId: result._id,
                quantity: item.quantity,
                subTotal: item.quantity * item.price
            }
            var resultOrderItem = await orderItemModel.create(newOrderItem);
            if (resultOrderItem) {
              let productUpdateStock = await productStockModel
                .findOne({productId:item.productId,variationId: item.variationId, shopId:order.shopId})
                .exec();
              if(productUpdateStock) {
                productUpdateStock.quantity = productUpdateStock.quantity - Number.parseInt(item.quantity);
                await productUpdateStock.save();
                html += `product: ${item.productId}, variation: ${item.variationId}, price: ${item.price}, quantity: ${item.quantity}, subTotal:${item.quantity * item.price}<br \>`
              } else {
                res.status(400).send({
                  message: `Create  order fail. Can not find stock data for product Id: ${item.productId}`
                });
              }
            }
          }
          html += `Subtotal: ${order.subTotal}<br \>`
          html += `Shipping Fee: ${order.shippingFee}<br \>`
          html += `Total: ${order.totalPrice}<br \>`
        } else {
          console.log("loi")
          res.status(400).send({
            message: "Create  order fail."
          });
        }
      await sendMail({email:order.email,subject:"New order created",html:html})
    }
    console.log("OK")
    res.status(201).send({
        message: "Create  order success"
    });
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

      const orderItems = await orderItemModel.find({orderId: orderId}).populate("productId").populate("variationId").exec();
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
