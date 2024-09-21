const userController = require("../controllers/userController");
const router = require("express").Router();

router.post('/api/v1/user/register', (req, res) => userController.register(req.res));
router.get('/api/v1/user/:id', (req, res) => userController.getUser(req.res));
router.post('/api/v1/user/login', (req, res) => userController.loginUser(req.res));

module.exports = router;