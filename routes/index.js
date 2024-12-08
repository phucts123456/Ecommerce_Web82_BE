const userRouter = require("./user");
const roleRouter = require("./role");
const categoryRouter = require("./category");
const router = require("express").Router();
const productRouter = require("./product");
const rattingRouter = require("./ratting");
const orderRouter = require("./order");
const shippingRouter = require("./shipping");
const shopRouter = require("./shop");
router.use(userRouter);
router.use(productRouter);
router.use(roleRouter);
router.use(categoryRouter);
router.use(rattingRouter);
router.use(orderRouter);
router.use(shippingRouter);
router.use(shopRouter);

module.exports = router;