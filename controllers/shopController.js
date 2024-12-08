const ShopModel = require("../models/ShopModel");
const userModel = require("../models/userModel");
const roleModel = require("../models/roleModel");
const bcrypt = require("bcrypt");

const addShop = async (req, res) => {
  const { name, wardId, districId, provinceId, address, phoneNumber, email, role, password, fullName  } = req.body;
  const salt = bcrypt.genSaltSync();
  const hashPassword = bcrypt.hashSync(password, salt);
  const userShop = await ShopModel.findOne({ name: name }).exec();

    // Regist user
    const userFromDB = await userModel.findOne({ userName: email, phoneNumber: phoneNumber }).exec();
    const roleFromDB = await roleModel.findOne({ name: role }).exec();
    let newUser = new userModel();
    if (!userFromDB && roleFromDB) {
        newUser = {
            userName: email,
            email: email,
            roleId: roleFromDB._id,
            address: address,
            phoneNumber: phoneNumber,
            fullName: fullName,
            password: hashPassword,
            isDelete: false,
        };
        await userModel.create(newUser);
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

    if (!userShop) {
        const newShop = {
            name: name,
            wardId: wardId,
            districId: districId,
            provinceId: provinceId,
            address: address,
            userId: newUser.userId,
        };
        await ShopModel.create(newShop);
        res.status(201).send({
        message: "Create Shop success!",
        data: newShop,
        });
    } else {
        await userModel.deleteOne({_id: newUser._id}).exec();
        res.status(400).send({
        message: "Create Shop fail, this Shop already existed",
        });
    }
};

const getShop = async (req, res) => {
  const totalItems = await ShopModel.find().limit().exec();
  res.status(200).send({
      message: 'Get Shop success',
      data: totalItems
  });
}


module.exports = {
  addShop,
  getShop
};
