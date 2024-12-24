const router = require("express").Router();
const productStockController = require("../controllers/productStockController");

router.get("/api/v1/product-stock", (req, res) => productStockController.getProductStockModel(req, res));
router.get("/api/v1/product-stock/detail", (req, res) => productStockController.getDetail(req, res));
router.put("/api/v1/product-stock", (req, res) => productStockController.update(req, res));
module.exports = router;