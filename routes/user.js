const userController = require("../controllers/userController");
const router = require("express").Router();
router.post('/api/v1/user/register', (req, res) => userController.register(req, res));//đăng ký
router.post('/api/v1/user/login',  (req, res) => userController.loginUser(req, res));//đăng nhập
router.get('/api/v1/user/:id',  (req, res) => userController.getUser(req, res));//lấy user
router.get('/api/v1/user',  (req, res) => userController.getAlluser(req, res));//lấy all user
router.delete('/api/v1/user/:id',  (req, res) => userController.deleteUser(req, res));//delete user
router.put('/api/v1/user/active/:id',  (req, res) => userController.activeUser(req, res));//delete user
router.post('/api/v1/user/login-admin',  (req, res) => userController.loginAdmin(req, res));//đăng nhập

module.exports = router;