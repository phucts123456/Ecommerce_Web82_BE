const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

const orderItemSchema = moongose.Schema({
    orderId: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref : 'products',
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true,
    },
    subTotal: {
        type: Number,
        require: true,
    }
});

const orderItemModel = mongoose.model("orderItems", orderItemSchema);

module.exports = orderItemModel;