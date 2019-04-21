const express = require('express');
const router = express();
const ProductController = require('../controllers/productController');
const {adminVerification} = require('../middlewares/authentication.js')
const images = require('../helpers/images')
/* GET users listing. */

//All Users - without authentication
router.get('/', ProductController.displayProductAll);
router.get('/:id', ProductController.displayProductDetail);

// Admin Only
router.use(adminVerification)
router.post('/register', images.multer.single('image'), images.sendUploadToGCS, ProductController.createProduct);
router.put('/edit/:id', ProductController.editProduct);
router.delete('/delete/:id', ProductController.deleteProduct);

module.exports = router;