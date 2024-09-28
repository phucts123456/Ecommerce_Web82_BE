const orderController = require('../controllers/orderController');
const router = require('express').Router();
const jwtCheckMiddleware = require('../middleware/middleware').jwtCheckMiddleware;

router.post("/api/v1/orders", jwtCheckMiddleware, (req, res) => orderController.createOrder(req, res));

module.exports = router;