const productModel = require('../models/productModel');
const constants = require('../util/constants');
const getProduct = async (req, res) => {
    const pageNumber = req.query.pn;
    const searchKey = req.query.sk;
    const limit = req.query.limit
    const pageSize = limit ? limit : constants.CONST_PRODUCT_PER_PAGE;
    const skip = (pageNumber - 1) * pageSize;
    const searchModel = searchKey !== '' ? {name: { $regex: '.*' + searchKey + '.*' }, } : {}
    const totalItems = await productModel.find(searchModel).skip(skip).limit(pageSize).populate("categoryId").populate("rate").exec();
    const totalProduct = totalItems.length; 
    const totalPage = Math.ceil(totalProduct / pageSize);
    const data = {
        totalItems: totalProduct,
        totalPage: totalPage,
        currentPage: pageNumber,
        items: totalItems
    }
    res.status(200).send({
        message: 'Get product success',
        data: data
    })
}

const createProduct = async (req, res) => {
    const productName = req.body.name;
    const productPrice = req.body.price;
    const isAvailable = req.body.isAvailable;
    const quantity = req.body.quantity;
    const description = req.body.description;
    const categoryId = req.body.categoryId;
    const isProductExist = await productModel.findOne({name: productName}).exec();
    console.log(isProductExist);
    if(!isProductExist) {
        const newProduct = {
            name: productName,
            price: productPrice,
            isAvailable: isAvailable,
            quantity: quantity,
            description: description,
            categoryId: categoryId
        }
        await productModel.create(newProduct);
        res.status(201).send({
            message: "Create product success",
            data: newProduct
        })
    } else {
        res.status(400).send({
            message: "Create product fail",
        })
    }
}

module.exports = {
    getProduct,
    createProduct
}