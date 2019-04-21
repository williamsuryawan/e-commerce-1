const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const {authentication} = require('../middlewares/authentication.js')
/* GET users listing. */

router.get('/', UserController.findUser)
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/login/admin', UserController.loginAdmin);

router.get('/verify', UserController.verifyToken);
router.use(authentication)
router.get('/detail', UserController.getUserDetail)
router.put('/edit', UserController.editUser)


module.exports = router;