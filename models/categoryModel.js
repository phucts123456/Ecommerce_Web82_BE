const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type : String,
        require: true,
    }
})

const categoryModel = mongoose.model("categories", categorySchema);

module.exports = categoryModel;