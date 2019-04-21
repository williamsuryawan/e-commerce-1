const Transaction = require('../models/transaction');
const Cart = require('../models/cart');
const Product = require('../models/product');
const {getTotalWeight, getDeliveryCost, getProductCost} = require('../helpers/deliveryCalculation.js')
// const jwtConvert = require('../helpers/jwtConvert')

class TransactionController {
    static seeAllTransaction (req,res) {
        console.log("masuk ke lihat transaction", req.loggedInUser)
        Transaction
            .find({})
            .populate('listsProduct.productId')
            .populate('userId')
            .then(listTransaction => {
                console.log("All Transaction ditemukan", listTransaction)
                res.status(200).json({data: listTransaction})
            })
            .catch(error => {
                console.log("error get transaction", error)
                res.status(500).json(error)
            })
    }
    
    static seeTransaction (req,res) {
        console.log("masuk ke lihat transaction", req.loggedInUser)
        let obj = {
            userId: req.loggedInUser.id
        }
        Transaction
            .find(obj)
            .populate('listsProduct.productId')
            .then(listTransaction => {
                console.log("Transaction ditemukan", listTransaction)
                res.status(200).json({data: listTransaction})
            })
            .catch(error => {
                console.log("error get transaction", error)
                res.status(500).json(error)
            })
    }

    static getOneTransaction (req,res) {
        Transaction.findOne({
            "_id": req.params.id
        })
        .populate('listsProduct.productId')
        .then (foundTransaction => {
            res.status(200).json({data: foundTransaction})
        })
        .catch(error => {
            console.log("error get one transaction", error)
            res.status(500).json(error)
        })
    }
    static  createTransaction (req,res) {
        console.log("masuk ke create transaction", req.loggedInUser)
        Cart
            .findOne({
                userId: req.loggedInUser.id
            })
            .populate('listsProduct.productId')
            .then( async foundCart => {
                console.log("cart ditemukan", foundCart)
                if(foundCart.listsProduct.length > 0) {
                    // console.log("isi cart untuk transaction:", foundCart.listsProduct)
                    let arrayProduct = []
                    foundCart.listsProduct.forEach(product =>{
                        console.log("loopind dalam isi cart", product)
                        arrayProduct.push(product)
                    })
                    
                    let weightTotal = null
                    let deliveryCost = null
                    let productCost = null

                    console.log("maasuk while loop")
                    weightTotal = await getTotalWeight(arrayProduct)
                    deliveryCost = await getDeliveryCost(req.loggedInUser, weightTotal)
                    productCost = await getProductCost(arrayProduct)

                    console.log("hasil helpers create new transaction", weightTotal,deliveryCost, productCost)
                    
                    let newObj = {
                        listsProduct: foundCart.listsProduct,
                        userId: req.loggedInUser.id,
                        totalWeight: weightTotal,
                        productCharge: productCost,
                        deliveryCharge: deliveryCost,
                        totalCharge: (productCost+deliveryCost),
                        transactionStatus: null,
                        paymentType: null,
                        deliveryStatus: null,
                    }
                    return Transaction
                        .create(newObj)
                        .then(newTransaction => {
                            console.log("transaksi berhasil dibuat", newTransaction)
                            res.status(201).json(newTransaction)
                        })
                } else {
                    throw ("cart does not have anything, shop first")
                }
            })
            .catch(err => {
                console.log("terjadi error buat new transaksi", err)
                res.status(409).json(err)
            })
    }
    static updateTransaction (req,res) {
        console.log("masuk ke update transaction", req.body, req.loggedInUser, req.params.id)
        Transaction.findOne({
            "_id": req.params.id
        })
        .then(async foundTransaction => {
            console.log("transaction berhasil ditemukan")
                if(req.body.changeCart) {
                    return Cart
                        .findOne({
                            userId: req.loggedInUser.id
                        })
                        .then(async foundCart => {
                            console.log("cart ditemukan", foundCart)
                            if(foundCart.listsProduct.length > 0) {
                                console.log("isi cart untuk transaction:", )
                                foundTransaction.transactionStatus = foundCart.listsProduct
                                let weightTotal = await getTotalWeight(foundCart.listsProduct)
                                let deliveryCost = await getDeliveryCost (req.loggedInUser, weightTotal)
                                let productCost = await getProductCost(foundCart.listsProduct)
                                foundTransaction.totalweight=weightTotal;
                                foundTransaction.deliveryCharge=deliveryCost;
                                foundTransaction.totalCharge=(productCost+deliveryCost);
                                foundTransaction.productCharge=productCost
                            } else {
                                res.status(400).json("cart product list can't be empty")
                            }
                        })
                }
                if(req.body.changeAddress) {
                    console.log('transaction edit change address, input: ', foundTransaction)
                    let tempProductCost = Number
                    tempProductCost = await (foundTransaction.totalCharge-foundTransaction.deliveryCharge)
                    let deliveryCost = await getDeliveryCost (req.loggedInUser, foundTransaction.totalWeight)
                    foundTransaction.deliveryCharge=deliveryCost;
                    foundTransaction.totalCharge = (tempProductCost+deliveryCost)
                    console.log('transaction edit change address, result: ', tempProductCost, deliveryCost)
                }
                if(req.body.transactionStatus) {
                    foundTransaction.transactionStatus = req.body.transactionStatus
                }
                if(req.body.paymentType) {
                    foundTransaction.paymentType = req.body.paymentType
                }
                if(req.body.deliveryStatus) {
                    foundTransaction.deliveryStatus = req.body.deliveryStatus
                }
            return foundTransaction
                        .save()
                        .then(updatedTransaction => {
                            res.status(201).json(updatedTransaction)
                        })
        })
        .catch (err => {
            console.log("terjadi error update cart", err)
            res.status(400).json(err)
        })
    }

    static repeatTransaction (req,res) {
        console.log("masuk ke repeat transaction", req.body, req.loggedInUser, req.params.id)
        Transaction.findOne({
            "_id": req.params.id
        })
        .then (foundTransaction => {
            console.log("transaction berhasil ditemukan")
            return Cart
                .findOne({
                    userId: req.loggedInUser.id
                })
                .then(foundCart => {
                    foundCart.listsProduct = foundTransaction.listsProduct
                    return foundCart
                        .save()
                        .then(updatedCart => {
                            res.status(201).json(updatedCart)
                        })
                })
        })
        .catch (err => {
            console.log("terjadi error repeat transaction to existing cart", err)
            res.status(400).json(err)
        }) 
    }

    static deleteTransaction (req,res) {
        console.log("masuk ke delete transaction")
        Transaction.findOne({
            _id: req.params.id
        })
        .then(foundTransaction =>{
            console.log("Product yang akan didelete ditemukan:", foundTransaction, req.loggedInUser)
            if(foundTransaction.transactionStatus == null || foundTransaction.transactionStatus == 'Waiting for Payment') {
                return Transaction.findOneAndDelete({
                    _id: req.params.id
                })
                .then(transactionDelete => {
                    console.log("Hasil delete: ", transactionDelete)
                    res.status(200).json({
                        msg: 'Transaction has been deleted',
                        data: transactionDelete
                    })
                })
            } else {
                throw 'You cant delete this transaction'
            }
            
        })
        .catch( error =>{
            res.status(500).json({
                msg: 'ERROR deleting transaction ',error
            })
        })
    }
}

module.exports = TransactionController;