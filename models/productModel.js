const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

const productSchema = moongose.Schema({
    name: {
        type: String,
    },
    shopId: {
        type: mongoose.Schema.ObjectId,
        ref: "shops",
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    isAvailable: {
        type: Boolean,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref : 'categories',
        require: true
    },
    rate: [{
        type: mongoose.Types.ObjectId,
        ref : 'userProductRate',
        require: true
    }],
    image: {
        type: String,
        require: true
    },
    variations: {
        type: [],
        require:true,
        ref: "productVariations",
    }
});

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;