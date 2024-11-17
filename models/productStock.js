const mongoose = require('mongoose');

const productStockSchema = mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    color: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    }
});

const productStockModel = mongoose.model("productStocks", productStockSchema);

module.exports = productStockModel;