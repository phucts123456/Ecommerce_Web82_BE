const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

const orderSchema = moongose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    totalPrice: {
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
    companyName: {
        type: String,
        require: true
    },
    apartment: {
        type: String,
    },
    city: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
});

const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;