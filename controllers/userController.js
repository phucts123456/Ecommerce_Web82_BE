const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("./constants.js")
const roleModel = require("../models/roleModel");
const { default: mongoose } = require("mongoose");

const register = async (req, res) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const fullName = req.body.fullName;
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber;
  const address = req.body.address;
  const role = req.body.role;
  const salt = bcrypt.genSaltSync();
  const hashPassword = bcrypt.hashSync(password, salt);

  const userFromDB = await userModel.findOne({ userName: userName }).exec();
  const roleFromDB = await roleModel.findOne({ name: role }).exec();
  if (!userFromDB && roleFromDB) {
    const newUser = {
      userName: userName,
      email: email,
      roleId: roleFromDB._id,
      address: address,
      phoneNumber: phoneNumber,
      fullName: fullName,
      password: hashPassword,
      isDelete: false,
    };
    await userModel.create(newUser);
    res.status(201).send({
      message: "User is created",
      data: newUser,
    });
  } else {
    if (!roleFromDB) {
      return res.status(400).send({
        message: "Create user fail.Role is not existed",
      });
    } else {
      return res.status(400).send({
        message: "Create user fail.User is existed",
      });
    }
  }
};

const loginUser = async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const userFromDB = await userModel.findOne({ userName: userName }).exec();
  const isCorrectPassword = userFromDB
    ? bcrypt.compareSync(password, userFromDB.password)
    : false;
  if (userFromDB && isCorrectPassword) {
    if (userFromDB.isDelete === true) {
      return res.status(400).send({
        message:
          "Login fail. This user has been locked. " +
          "\n Please contact admin.",
      });
    }
    const accessTokenSecret = process.env.ACCESSS_TOKEN_SECERT_KEY;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECERT_KEY;
    const userPayload = {
      userName: userFromDB.userName,
    };
    const accessToken = jwt.sign({ id: userFromDB.id }, accessTokenSecret, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ id: userFromDB.id }, refreshTokenSecret, {
      expiresIn: "1d",
    });
    return res.status(200).send({
      message: "Login success",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } else {
    return res.status(400).send({
      message: "Login fail. Wrong username or password",
    });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.id;
  
  const userFromDB = mongoose.isValidObjectId(userId) ? await userModel.findById(userId).populate("roleId").exec()  : null;

  if (userFromDB) {
    res.status(200).send({
      message: "Get user success",
      data: userFromDB,
    });
  } else {
    res.status(400).send({
      message: "User not found",
    });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const userFromDB = await userModel.findById(userId);
    if (!userFromDB) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    userFromDB.isDelete = true;
    await userFromDB.save();

    res.status(200).send({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

const activeUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const userFromDB = await userModel.findById(userId);
    if (!userFromDB) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    userFromDB.isDelete = false;
    await userFromDB.save();

    res.status(200).send({
      message: "User active successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to active user",
      error: error.message,
    });
  }
};

const getAlluser = async (req, res) => {
  const pageNumber = req.query.pn;
  const searchKey = req.query.sk;
  const limit = req.query.limit;
  const pageSize = limit ? limit : constants.CONST_USER_PER_PAGE; // Bạn cần xác định giá trị cho CONST_USER_PER_PAGE
  const skip = (pageNumber - 1) * pageSize;

  let searchModel =
    searchKey !== "" && searchKey !== undefined
      ? { userName: { $regex: ".*" + searchKey + ".*", $options: "i" } } // Tìm kiếm theo tên người dùng
      : {};

  let total = await userModel.countDocuments(); 
  let totalUsers = await userModel
    .find(searchModel)
    .skip(skip)
    .limit(pageSize)
    .populate("roleId")
    .exec();
  const totalPage = Math.ceil(total / pageSize); 
  const data = {
    totalItems: total,
    totalPage: totalPage,
    currentPage: pageNumber,
    items: totalUsers,
  };

  return res.status(200).send({
    message: "Get user All is success",
    data: data,
  });
};

module.exports = {
  register,
  getUser,
  loginUser,
  deleteUser,
  getAlluser,
  activeUser
};
