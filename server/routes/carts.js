const express = require('express');
const router = express();
const CartController = require('../controllers/cartController');
const { authentication, authorizationCart } = require('../middlewares/authentication.js')

router.use(authentication)
router.get('/', CartController.seeCart);
router.post('/', authorizationCart, CartController.addProduct);
router.put('/reduce', authorizationCart, CartController.reduceProduct);
router.put('/empty', authorizationCart, CartController.removeAllProducts);

module.exports = router;