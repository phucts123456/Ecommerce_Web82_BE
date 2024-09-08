const roleModel = require("../models/roleModel");

const addRole = async (req, res) => {
    const name = req.body.name;
    const permissons = req.body.permissons;

    const userRole = await roleModel.findOne({name:name}).exec();
    if(!userRole) {
        const newRole = {
            name: name,
            permissons: permissons
        };
        await roleModel.create(newRole);
        res.status(201).send({
            messsage: "Create role success",
            data: newRole
        })
    } else {
        res.status(400).send({
            messsage: "Create role fail. Role is existed"
        })
    }
}

module.exports = {
    addRole
};