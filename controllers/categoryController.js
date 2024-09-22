const categoryModel = require('../models/categoryModel');
const constants = require('../util/constants');

const createCategory = async (req, res) => {
    const categoryName = req.body.name;
    const isExistCategory = await categoryModel.findOne({name:categoryName}).exec();
    if (!isExistCategory) {
        const newCategory = {
            name: categoryName
        }
        await categoryModel.create(newCategory);
        res.status(201).send({
            message: "Create category success",
            data: newCategory
        });
    } else {
        res.status(400).send({
            message: "Create category fail",
        });
    }   
}

const getCategory = async (req, res) => {
    const limit = req.query.limit
    const pageSize = limit ? limit : constants.CONST_CATEGORY_PER_PAGE;
    const totalItems = await categoryModel.find().limit(pageSize).exec();
    res.status(200).send({
        message: 'Get category success',
        data: totalItems
    });
}

module.exports = {
    createCategory,
    getCategory
}