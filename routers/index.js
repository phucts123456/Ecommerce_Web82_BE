const userRouter = require("./user");
const roleRouter = require("./role");
const router = require("express").Router();

router.use(userRouter);
router.use(roleRouter);

module.exports = router;