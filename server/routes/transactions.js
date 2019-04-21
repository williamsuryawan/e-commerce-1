const express = require('express');
const router = express();
const TransactionController = require('../controllers/transactionController');
const { authentication, authorizationTransaction, adminVerification } = require('../middlewares/authentication.js')

router.use(authentication)
router.get('/all', adminVerification, TransactionController.seeAllTransaction);

router.use(authorizationTransaction)
router.get('/', TransactionController.seeTransaction);
router.post('/create', TransactionController.createTransaction);
router.get('/:id', TransactionController.getOneTransaction);
router.put('/edit/:id', TransactionController.updateTransaction);
router.put('/duplicate/:id', TransactionController.repeatTransaction);
router.delete('/delete/:id', TransactionController.deleteTransaction)

module.exports = router;