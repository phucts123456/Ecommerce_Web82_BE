const roleModel = require("../models/Role");

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
      message: "Tạo vai trò thành công!",
      data: newRole,
    });
  } else {
    res.status(400).send({
      message: "Tạo vai trò thất bại, Vai trò đã tồn tại",
    });
  }
};

module.exports = {
  addRole,
};
