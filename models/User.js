const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

const userSchema = moongose.Schema({
    userName: {
        type: String,
    },
    password: {
        type: String,
        require: true
    },
    fullName: {
        type: String,
        require: true
    },
    roleId: {
        type: mongoose.Types.ObjectId,
        ref: 'roles',
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    email:{
      type:String,
      require:true
    }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;