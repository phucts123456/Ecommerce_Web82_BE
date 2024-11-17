const mongoose = require('mongoose');

const productVariationSchema = mongoose.Schema({
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
        require: true,
    },
    image: {
        type: String,
        require: true,
    }
});

const productVariationModel = mongoose.model("productVariations", productVariationSchema);

module.exports = productVariationModel;