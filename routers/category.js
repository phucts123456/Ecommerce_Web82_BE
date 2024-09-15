const categoryController = require('../controllers/categoryController');
const router = require('express').Router();

router.post("/api/v1/categories", (req, res) => categoryController.createCategory(req, res));

module.exports = router;