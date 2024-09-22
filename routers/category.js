const categoryController = require('../controllers/categoryController');
const router = require('express').Router();

router.post("/api/v1/categories", (req, res) => categoryController.createCategory(req, res));
router.get("/api/v1/categories", (req, res) => categoryController.getCategory(req, res));

module.exports = router;