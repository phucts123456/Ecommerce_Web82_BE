const router = require("express").Router();
const productController = require("../controllers/productController");

router.get("/api/v1/products", (req, res) => productController.getProduct(req, res));
router.post("/api/v1/products", (req, res) => productController.createProduct(req, res));

module.exports = router;