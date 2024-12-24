const mongoose = require('mongoose');

const productStockSchema = mongoose.Schema({
    shopId: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    productId: {
        ref:'products',
        type: mongoose.Types.ObjectId,
        require: true,
    },
    variationId: {
        ref:'productVariations',
        type: mongoose.Types.ObjectId,
        require: true,
    },
    quantity: {
        type: Number,
        require: true,
    }
});

const productStockModel = mongoose.model("productStocks", productStockSchema);

module.exports = productStockModel;