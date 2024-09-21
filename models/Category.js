const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const CategorySchema = moongose.Schema({
  name: {
    type: String,
    require: true,
  },
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
