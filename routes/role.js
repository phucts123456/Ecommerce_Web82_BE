const roleController = require("../controllers/roleController");
const router = require("express").Router();

router.post("/api/v1/role/add", (req, res) => roleController.addRole(req, res));

module.exports = router;
