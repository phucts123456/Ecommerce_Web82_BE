const userProductRateModel = require("../models/UserProductRateModel");
const productModel = require("../models/productModel");
const createRatting = async (req, res) => {
  const userId = req.body.userId;
  const productId = req.body.productId;
  const rate = req.body.ratting;
  const comment = req.body.comment;
  const isExistRatting = await userProductRateModel
    .findOne({ userId: userId, productId: productId })
    .exec();
  const isExistProduct = await productModel.findById(productId).exec();
  if (!isExistRatting && isExistProduct) {
    const newRatting = {
      userId: userId,
      productId: productId,
      ratting: rate,
      comment: comment,
    };
    const ratting = await userProductRateModel.create(newRatting);
    console.log("isExistProduct.rate");
    console.log(isExistProduct.rate);
    console.log("ratting.id");
    console.log(ratting.id);
    const product = await productModel
      .updateOne(
        { _id: productId },
        { rate: [...isExistProduct.rate, ratting.id] }
      )
      .catch(async (error) => {
        await userProductRateModel.deleteOne({ _id: ratting.id });
        res.status(400).send({
          message: "Rate fail.Update product ratting fail.",
        });
      });
    res.status(201).send({
      message: "Ratting success",
      rateData: ratting,
      productData: product,
    });
  } else {
    res.status(400).send({
      message: "Rate fail.This user have already rated this product.",
    });
  }
};

module.exports = {
  createRatting,
};
