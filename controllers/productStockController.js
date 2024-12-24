const { default: mongoose } = require('mongoose');
const productModel = require('../models/productModel');
const productStockModel = require('../models/productStock');
const constants = require("../utils/constants");
const getProductStockModel = async (req, res) => {
    const {sk, pn, limit, sid } = req.query;
    console.log("sid")
    console.log(sid)
    const pageSize = limit 
        ? limit
        : constants.CONST_PRODUCT_STOCK_PER_PAGE;
    const skip = (pn - 1) * pageSize;
    let searchProductModel = sk
        ?   {name: { $regex: '.*' + sk + '.*' },shopId : sid} 
        :   {shopId : sid}
    const productSearch = await productModel
        .find(searchProductModel)
        .select("_id")
        .exec();
    console.log(productSearch)
    let totalItems = [];

    if (productSearch.length > 0) {
        totalItems = await productStockModel
            .find({productId: {$in:productSearch}})
            .populate("productId")
            .populate("variationId")
            .skip(skip)
            .limit(pageSize)
            .exec();
    }
    let total = await productStockModel.countDocuments();
    const totalPage = Math.ceil(total / pageSize);
    let data = {
        totalItems: total,
        totalPage: totalPage,
        currentPage: pn,
        items: totalItems
    }
    return res.status(200).json({
        message:'get stock data success.',
        data: data
    })
}

const getDetail = async (req, res) => {
    console.log(req.query.pid)
    const productId = req.query.pid;
    const variationId = req.query.vid;
    const shopId = req.query.sid;
    console.log("shopId")
    console.log(shopId)
    const isExistProductStock = await productStockModel
        .findOne({productId: productId,variationId: variationId,shopId:shopId})
        .populate("productId")
        .populate("variationId")
        .exec(); 
    if (isExistProductStock) {
        res.status(200).send({
            message: 'Get product stock success',
            data: isExistProductStock
        })
    } else {
        res.status(400).send({
            message: 'This product stock is not available'
        })
    }
  }

  const update = async (req, res) => {
    const {shopId ,productId, variationId, quantity} = req.body;
    const isExistProductStock = await productStockModel
        .findOne({productId: productId,variationId: variationId,shopId:shopId})
        .populate("productId")
        .populate("variationId")
        .exec(); 
    if (isExistProductStock) {
        isExistProductStock.quantity = quantity
        await isExistProductStock.save();
        res.status(200).send({
            message: 'Update stock success'
        })
    } else {
        res.status(400).send({
            message: 'This product stock is not available'
        })
    }
  }
module.exports = {
    getProductStockModel,
    getDetail,
    update
}