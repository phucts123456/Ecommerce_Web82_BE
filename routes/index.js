const userRouters = require("./userRoutes");
const roleRouters = require("./roleRoutes");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes.js")
const inventoryRoutes = require("./inventoryRoutes");
const categoryRoutes = require("./categoryRoutes");


const router = require("express").Router();

router.use(userRouters);
router.use(roleRouters);
router.use(productRoutes);
router.use(orderRoutes);
router.use(inventoryRoutes);
router.use(categoryRoutes);

module.exports = router;
