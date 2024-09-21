const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

const InventorySchema = moongose.Schema({
    puductid: {
        type: mongoose.Types.ObjectId,
    },
    orderid: {
        type: mongoose.Types.ObjectId,
    },
    quantity: {
        type: String,
    },
});

const InventoryModel = mongoose.model("inventory", InventorySchema);

module.exports = InventoryModel;