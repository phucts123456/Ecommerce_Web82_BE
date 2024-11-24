const StoreModel = require("../models/storeModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const addStore = async (req, res) => {
  const { name, wardId, districId, provinceId, address, phoneNumber, email, userName, role  } = req.body;
  const salt = bcrypt.genSaltSync();
  const hashPassword = bcrypt.hashSync(password, salt);
  const userStore = StoreModel.findOne({ name: name }).exec();

    // Regist user
    const userFromDB = await userModel.findOne({ userName: userName }).exec();
    const roleFromDB = await roleModel.findOne({ name: role }).exec();
    let newUser = new userModel();
    if (!userFromDB && roleFromDB) {
        newUser = {
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

    if (!userStore) {
        const newStore = {
            name: name,
            wardId: wardId,
            districId: districId,
            provinceId: provinceId,
            address: address,
            userId: newUser.userId,
        };
        await StoreModel.creare(newStore);
        res.status(201).send({
        message: "Create Store success!",
        data: newStore,
        });
    } else {
        res.status(400).send({
        message: "Create Store fail, this Store already existed",
        });
    }
};

const getStore = async (req, res) => {
  const totalItems = await StoreModel.find().limit().exec();
  res.status(200).send({
      message: 'Get Store category success',
      data: totalItems
  });
}


module.exports = {
  addStore,
  getStore
};
