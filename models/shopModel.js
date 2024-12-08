const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref:"users",
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true
    },
    wardId: {
        type: String,
        require: true
    },
    districtId: {
        type: Number,
        require: true
    },
    provinceId: {
        type: Number,
        require: true
    }
});

const shopModel = mongoose.model("shops", shopSchema);

module.exports = shopModel;