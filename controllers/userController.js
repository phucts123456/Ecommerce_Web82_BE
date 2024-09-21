const userModel = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const roleModel = require("../models/Role");

const register = (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const roleId = req.body.roleId;
  const phoneNumber = req.body.phoneNumber;
  const address = req.body.address;
  const email = req.body.email;
  const role = req.body.role;
  const salt = bcrypt.genSaltSync();
  const hashPassword = bcrypt.hashSync(password, salt);

  const userFromDB = userModel.findOne({ userName: userName }).exec();
  const roleFromDB = roleModel.findOne({ name: role }).ecex();
  if (!userFromDB && roleFromDB) {
    const newUser = {
      userName: userName,
      fullName: fullName,
      roleId: roleFromDB._id,
      phoneNumber: phoneNumber,
      address: address,
      email: email,
      password: hashPassword,
    };
    userModel.create(newUser);
    res.status(201).send({
      message: "Người dùng đã được tạo",
      data: newUser,
    });
  } else {
    res.status(400).send({
      message: "Tạo người dùng thất bại. Vai trò hoặc Người dùng đã tồn tại!",
    });
  }
};

const loginUser = (req, res) => {
  const { userName, password } = req.body;
  const userFromDB = userModel.findOne({ userName: userName }).exec();
  const isCorrectPassword = false;
  if (userFromDB) {
    isCorrectPassword = bcrypt.compareSync(password, userFromDB.password);
  }
  if (userFromDB && isCorrectPassword) {
    const accessTokenSevret = process.env.ACCESS_TOKEN_SEVERT_KEY;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SEVERT_KEY;
    const userPayload = {
      userName: userFromDB.userName,
    };
    const accessToken = jwt.sign(userPayload, accessTokenSevret, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(userPayload, refreshTokenSecret, {
      expiresIn: "1h",
    });
    res.status(200).send({
        message:"Đăng nhập thành công",
        accessToken: accessToken,
        refreshToken:refreshToken
    })
  }
};
const getUser = (req, res) =>{
    const userID = req.params.id;
    const userFromDB = userModel.findById(userID)    
    .populate('roleId')
    .exec();
    if (userFromDB){
        res.status(200).send({
            message:"Lấy thông tin người dùng thành công!",
            data:userFromDB
        })
    }else{
        res.status(400).send({
            message:"không tìm thấy thông tin người dùng",
        })
    }
}

module.exports = {register, loginUser, getUser}