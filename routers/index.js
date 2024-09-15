const userRouter = require("./user");
const roleRouter = require("./role");
const categoryRouter = require("./category");
const router = require("express").Router();
const productRouter = require("./product");
const rattingRouter = require("./ratting");
router.use(userRouter);
router.use(productRouter);
router.use(roleRouter);
router.use(categoryRouter);
router.use(rattingRouter);

module.exports = router;