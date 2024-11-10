const categoryController = require('../controllers/categoryController');
const router = require('express').Router();

router.post("/api/v1/categories", (req, res) => categoryController.createCategory(req, res));
router.put("/api/v1/categories", (req, res) => categoryController.updateCategoryName(req, res));
router.get("/api/v1/categories", (req, res) => categoryController.getCategory(req, res)); 
router.get("/api/v1/categories/all", (req, res) => categoryController.getAllCategory(req, res));
router.delete("/api/v1/categories/:id", (req, res) => categoryController.deleteCategory(req, res));

module.exports = router;