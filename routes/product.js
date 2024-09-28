const router = require("express").Router();
const productController = require("../controllers/productController");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/api/v1/products", (req, res) => productController.getProduct(req, res));
router.get("/api/v1/products/:id", (req, res) => productController.getDetail(req, res));
router.post('/api/v1/products',  upload.single('file'), (req, res) => productController.createProduct(req, res));
router.put('/api/v1/products/:id',  upload.single('file'), (req, res) => productController.updateProduct(req, res));

module.exports = router;