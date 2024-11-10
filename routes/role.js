const roleController = require("../controllers/roleController");
const router = require("express").Router();

router.post("/api/v1/roles/add", (req, res) => roleController.addRole(req, res));
router.get("/api/v1/roles/", (req, res) => roleController.getRole(req, res));

module.exports = router;
