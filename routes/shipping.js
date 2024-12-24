const shippingController = require("../controllers/shippingController");
const router = require("express").Router();

router.get("/api/v1/shipping/get-province", (req, res) => shippingController.getProvince(req, res));
router.get("/api/v1/shipping/get-district", (req, res) => shippingController.getDistrict(req, res));
router.get("/api/v1/shipping/get-ward", (req, res) => shippingController.getWard(req, res));
router.post("/api/v1/shipping/get-fee", (req, res) => shippingController.getShippingFeeForCart(req, res));
module.exports = router;