const categoryModel = require('../models/categoryModel');


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

module.exports = {
    createCategory
}