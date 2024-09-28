const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

const productSchema = moongose.Schema({
    name: {
        type: String,
    },
    price: {
        type: String,
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
        type: String,
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
    }
});

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;