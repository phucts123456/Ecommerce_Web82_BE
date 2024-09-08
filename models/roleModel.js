const moongose = require('mongoose');

const roleSchema = moongose.Schema({
    name: {
        type: String,
        require: true,
    },
    permissons: {
        type: [],
        require: true,
    }
});

const roleModel = moongose.model("roles", roleSchema);

module.exports = roleModel;