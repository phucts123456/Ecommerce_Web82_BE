const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const roleSchema = moongose.Schema({
  name: {
    type: String,
    require: true,
  },
  permissions: {
    type: [],
    require: true,
  },
});

const roleModel = mongoose.model("role", roleSchema);

module.exports = roleModel;
