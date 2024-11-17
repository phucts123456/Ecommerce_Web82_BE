const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
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
        type: String,
        require: true
    },
    provinceId: {
        type: String,
        require: true
    }
});

const storeModel = mongoose.model("stores", storeSchema);

module.exports = storeModel;