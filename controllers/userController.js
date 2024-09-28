const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const roleModel = require("../models/roleModel");

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

  const userFromDB = await userModel.findOne({userName: userName}).exec();
  const roleFromDB = await roleModel.findOne({name:role}).exec();
  if(!userFromDB && roleFromDB) {
      const newUser = {
          userName: userName,
          email: email,
          roleId: roleFromDB._id,
          address: address,
          phoneNumber: phoneNumber,
          fullName: fullName,
          password: hashPassword,
          isDelete: false,
      }
      await userModel.create(newUser);
      res.status(201).send({
          message: "User is created",
          data: newUser
      })
  } else {
      if(!roleFromDB) {
          res.status(400).send({
              message: "Create user fail.Role is not existed",
          })
      } else {
          res.status(400).send({
              message: "Create user fail.User is existed",
          })
      }
  }
}

const loginUser = async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const userFromDB = await userModel.findOne({userName:userName}).exec();
  const isCorrectPassword = userFromDB 
      ? bcrypt.compareSync(password, userFromDB.password) 
      : false;
  if(userFromDB && isCorrectPassword) {
      if(userFromDB.isDelete === true) {
        res.status(400).send({
            message: "Login fail. This user has been locked. "
            + "\n Please contact admin."
        })
      }
      const accessTokenSecret = process.env.ACCESSS_TOKEN_SECERT_KEY;
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECERT_KEY;
      const userPayload = {
          userName: userFromDB.userName
      }
      const accessToken = jwt.sign({id: userFromDB.id}, accessTokenSecret, { expiresIn: '1h' })
      const refreshToken = jwt.sign({id: userFromDB.id}, refreshTokenSecret, { expiresIn: '1d' })
      res.status(200).send({
          message: "Login success",
          accessToken: accessToken,
          refreshToken: refreshToken
      })
  } else {
      res.status(400).send({
          message: "Login fail. Wrong username or password"
      })
  } 
}

const getUser = async (req, res) => {
  const userId = req.params.id;
  const userFromDB = await userModel.findById(userId)
  .populate('roleId')
  .exec();

  if(userFromDB) {
      res.status(200).send({
          message:"Get user success",
          data: userFromDB
      })
  } else {
      res.status(400).send({
          message:"User not found",
      })
  }
}

module.exports = {
  register,
  getUser,
  loginUser
}