const shopController = require("../controllers/shopController");
const router = require("express").Router();

router.post("/api/v1/shops", (req, res) => shopController.addShop(req, res));

module.exports = router;
