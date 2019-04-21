const jwt = require('jsonwebtoken')
// const Product = require('../models/prodoct')
const Cart = require('../models/cart')
const Transaction = require('../models/transaction')
const User = require('../models/user')

module.exports = {
    authentication: function (req,res, next) {
        if(req.headers.hasOwnProperty('token')) {
            // console.log("req.body", req.body)
            console.log("Input verifikasi JWT", req.headers.hasOwnProperty('token'))
            try {
                const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
                console.log("Hasil verifikasi JWT", decoded)
                if( decoded != null) {
                    req.loggedInUser = decoded;
                    next()
                } else {
                    res.status(400).json({
                        message: 'Invalid Token'
                    })
                }
            } catch (err) {
                res.status(400).json({
                    message: 'Invalid Token'
                })
            }
        } else {
            res.status(400).json({
                message: 'Please provide token'
            })
        }
    },
    authorizationCart: function(req, res, next) {
        const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
        console.log("masuk authorization process", req.loggedInUser)
        Cart
            .findOne({userId: req.loggedInUser.id})
            .then(cart => {
                req.authorizedCart = cart;
                console.log("hasil authorized cart", req.authorizedCart)
                next();
            })
            .catch(error => {
                res.status(400).json({error: 'not authorizated for this cart'})
            })
    },
    authorizationTransaction: function(req, res, next) {
        const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
        console.log("masuk authorization process", req.loggedInUser)
        Transaction
            .findOne({userId: req.loggedInUser.id})
            .then(transaction => {
                req.authorizedTransaction = transaction;
                console.log("hasil authorized transaction", req.authorizedTransaction)
                next();
            })
            .catch(error => {
                res.status(400).json({error: 'not authorizated for this cart'})
            })
    },
    adminVerification: function (req,res, next) {
        if(req.headers.hasOwnProperty('token')) {
            console.log("Masuk verifikasi admin", req.headers.hasOwnProperty('token'))
            try {
                const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
                console.log("Hasil verifikasi JWT admin verification", decoded)
                if (decoded != null) {
                    User
                        .findOne({
                            _id: decoded.id
                        })
                    .then(user => {
                        console.log("hasil find admin", user)
                        if(user.role == 'admin') {
                            req.loggedInUser = user;
                            next();
                        } else {
                            res.status(400).json({
                                message: 'Not Admin Token'
                            })
                        }
                    })
                }
            } catch (err) {
                console.log(err)
                res.status(400).json({
                    message: 'Invalid Token'
                })
            }
        } else {
            res.status(400).json({
                message: 'Please provide token'
            })
        }
    }
}