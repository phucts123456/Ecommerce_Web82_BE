const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

const productSchema = moongose.Schema({
    name: {
        type: String,
    },
    pirce: {
        type: Number,
        require: true
    },
    isAvailable: {
        type: Boolean,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    categoryid: {
        type: String,
        require: true
    },
});

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;