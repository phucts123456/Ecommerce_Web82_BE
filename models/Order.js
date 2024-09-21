const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const orderSchema = moongose.Schema({
  productid: {
    type: mongoose.Types.ObjectId,
    type: String,
    require: true,
  },
  status: {
    type:String,
    require: true,
  },
  totalPrice: {
    type: Number,
    require: true,
  },
});

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
