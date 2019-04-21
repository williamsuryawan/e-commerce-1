const Cart = require('../models/cart');
const Product = require('../models/product');
// const jwtConvert = require('../helpers/jwtConvert')

class CartController {
    static seeCart (req,res) {
        console.log("masuk ke lihat cart", req.loggedInUser)
        Cart
            .find({
                userId: req.loggedInUser.id
            })
            .populate('listsProduct.productId')
            .then(listCart => {
                console.log("Cart ditemukan", listCart)
                res.status(200).json({data: listCart})
            })
            .catch(error => {
                res.status(500).json(error)
            })
    }
    
    static addProduct (req,res) {
        console.log("masuk ke method add product to cart", req.body, req.loggedInUser, req.authorizedCart)
        Product.findOne({_id: req.body._id})
            .then(product => {
                console.log("Produk ditemukan", product, product.stock, req.body.amount)
                if(Number(product.stock) >= Number(req.body.amount)) {
                    // produk tersedia di stock
                    let cartFound = req.authorizedCart
                    console.log("Hasil ketemu cart", cartFound)
                    var indexFound = 0;
                    var isExist = false;
                    cartFound.listsProduct.forEach((product, index) => {
                        if(product.productId == req.body._id) {
                            console.log("sudah ada produk sejenis")
                            isExist = true;
                            indexFound = index;
                        }
                    })
                    console.log("looping no use", isExist, indexFound)
                    // isExist False: Tidak ada produk sejenis, tambah object product
                    // isExist False: Sudah ada produk sejenis, tinggal tambah qty
                    if(!isExist) {
                        console.log("tidak ada produk sejenis")
                        cartFound.listsProduct.push({
                            productId: req.body._id,
                            qty: req.body.amount
                        })
                    } else {
                        console.log("Produk sejenis indeks:", cartFound.listsProduct[indexFound])
                        var beforeQty = Number(cartFound.listsProduct[indexFound].qty)
                        var addQty = Number(req.body.amount)
                        console.log("Cek number utk tambah qty", beforeQty, addQty)
                        cartFound.listsProduct[indexFound].qty = beforeQty + addQty;
                    }
                    console.log("hasil update", cartFound)
                    // Simpan Cart Terbaru dan Kurangi Jumlah Inventory di Database
                    return cartFound
                        .save()
                        .then(cartSaved => {
                            res.status(201).json(cartSaved)
                        })
                } else {
                    //barang tidak cukup, tidak bisa masuk cart
                    res.status(500).json({
                        msg: `Not Enough Quantity`
                    })
                }
            })
            .catch(error => {
                res.status(500).json(error);
            })
    }

    static reduceProduct (req,res) {
        console.log("masuk ke method reduce product to cart", req.body, req.loggedInUser, req.authorizedCart)
        Product.findOne({_id: req.body._id})
            .then(product => {
                console.log("Produk ditemukan", product)
                let cartFound = req.authorizedCart
                var indexFound = 0;
                var isExist = false;
                cartFound.listsProduct.forEach((product, index) => {
                    if(product.productId == req.body._id) {
                        console.log("produk sejenis untuk dikurangi ditemukan!")
                        isExist = true;
                        indexFound = index;
                    }
                })
                if(!isExist) {
                    console.log("tidak ada produk sejenis")
                    res.status(404).json({
                        msg: `Can't found the product`
                    })
                } else {
                    console.log("Produk sejenis indeks:", cartFound.listsProduct[indexFound])
                    var beforeQty = Number(cartFound.listsProduct[indexFound].qty)
                    var newQty = Number(req.body.amount)
                    console.log("Cek number utk tambah qty", beforeQty, newQty)
                    cartFound.listsProduct[indexFound].qty = beforeQty - newQty;
                }
                return cartFound
                        .save()
                        .then(cartSaved => {
                            res.status(201).json(cartSaved)
                        })
            })
            .catch(error => {
                res.status(500).json(error);
            })
    }

    static removeAllProducts (req,res) {
        let cartFound = req.authorizedCart
        cartFound.listsProduct = [];
        return cartFound.save()
        .then(emptiedCart =>{
            res.status(200).json(emptiedCart)
        })
        .catch(error => {
            res.status(404).json(err)
        })
    }
    
}

module.exports = CartController;