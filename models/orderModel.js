const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

const orderSchema = moongose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref:"users",
        require: true
    },
    totalPrice: {
        type: Number,
        require: true
    },
    shippingFee: {
        type: Number,
        require: true
    },    
    subTotal: {
        type: Number,
        require: true
    },    
    status: {
        type: String,
        require: true
    },
    streetAddress: {
        type: String,
        require: true
    },
    payment: {
        type: String,
        require: true
    },
    apartment: {
        type: String,
    },
    provinceId: {
        type: String,
    },
    districtId: {
        type: String,
    },
    wardId: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    orderDate: {
        type: Date,
    },
    shopId: {
        type: mongoose.Schema.ObjectId,
        require: true,
        ref:'shops'
    }
});

const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;