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
        type: String,
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
    img: {
        type: String,
        require: true
    },
    rate: [{
        type: mongoose.Types.ObjectId,
        ref : 'userProductRate',
        require: true
    }]
});

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;