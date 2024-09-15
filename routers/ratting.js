const router = require("express").Router();
const rattingController = require("../controllers/userProductRateController");

router.post("/api/v1/user-product-ratting", (req, res) => rattingController.createRatting(req, res));

module.exports = router;