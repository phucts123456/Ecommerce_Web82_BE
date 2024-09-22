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

module.exports = {
    createOrder
}