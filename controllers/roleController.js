const roleModel = require("../models/roleModel");

const addRole = (req, res) => {
  const { name, permissions } = req.body;

  const userRole = roleModel.findOne({ name: name }).exec();
  if (!userRole) {
    const newRole = {
      name: name,
      permissions: permissions,
    };
    roleModel.creare(newRole);
    res.status(201).send({
      message: "Create role success!",
      data: newRole,
    });
  } else {
    res.status(400).send({
      message: "Create role fail, this role already existed",
    });
  }
};

const getRole = async (req, res) => {
  const totalItems = await roleModel.find().limit().exec();
  res.status(200).send({
      message: 'Get role category success',
      data: totalItems
  });
}


module.exports = {
  addRole,
  getRole
};
