const orderController = require('../controllers/orderController');
const router = require('express').Router();
const jwtCheckMiddleware = require('../middleware/middleware').jwtCheckMiddleware;

router.post("/api/v1/orders", jwtCheckMiddleware, (req, res) => orderController.createOrder(req, res));
router.get("/api/v1/orders", (req, res) => orderController.getAllOrder(req, res));
router.get("/api/v1/orders/:id", (req, res) => orderController.getOrderById(req, res));
router.put("/api/v1/orders/updateStatus", (req, res) => orderController.updateOrderStatus(req, res));

module.exports = router;