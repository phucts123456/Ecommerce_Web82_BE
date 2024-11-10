const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

const userProductRateSchema = moongose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        require: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'products',
        require: true
    },
    rate: {
        type: Number,
        require: true
    },
    comment: {
        type: String,
        require: true,
    }
});

const userProductRateModel = mongoose.model("userProductRate", userProductRateSchema);

module.exports = userProductRateModel;